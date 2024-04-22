import { IProducts } from '../../types/products';
import { ProductReviews, ReviewsProduct, IReviews } from '../../types/reviews';
import ProductSchema from '../../database/nosql/schemas/productsSchema';
import GRPCErrorHandler from '../../helpers/error';
import reviewModel from '../../database/sql/tables/reviewModel';
import * as grpc from '@grpc/grpc-js';

export default class ReviewQueryRepository {
  getAll(): Promise<IReviews[]> {
    return reviewModel.findAll();
  }

  getById(id: string): Promise<IReviews | null> {
    return reviewModel.findOne({ where: { id }});
  }

  async getProductReviews (productId: string): Promise<ProductReviews> {
    const product = await ProductSchema.findOne({ id: productId }).lean().exec() as IProducts | null;
    if (!product) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Product not found');
    
    const reviews = (await reviewModel.findAll({ where: { productId }})).map(review => review.dataValues);

    return { reviews };
  }

  async getUsersReview (userId: string) {
    const reviews = await reviewModel.findAll({ where: { userId }});
    if (reviews.length === 0) {
      throw new GRPCErrorHandler(grpc.status.NOT_FOUND, `${userId} has not reviews`);
    }

    const products: ReviewsProduct[] = [];

    for (const review of reviews) {
      const product = await ProductSchema.findOne({ id: review.productId })
        .lean().exec() as IProducts | null;
      if (product) products.push({ userReviews: review, userProduct: product });
    }
    
    return products;
  }
}