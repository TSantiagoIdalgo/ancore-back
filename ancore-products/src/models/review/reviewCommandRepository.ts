import { IReviewModel, IReviews } from '../../types/reviews';
import reviewModel from '../../database/sql/tables/reviewModel';
import GRPCErrorHandler from '../../helpers/error';
import ProductSchema from '../../database/nosql/schemas/productsSchema';
import UserCartSchema from '../../database/nosql/schemas/cartSchema';
import * as grpc from '@grpc/grpc-js';

export default class ReviewCommandRepository {
  async create (review: IReviewModel): Promise<IReviews> {
    const cart = await UserCartSchema.findOne({ userId: review.userId });
    if (!cart) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Cart not found');
    if (!cart.isPaid) throw new GRPCErrorHandler(grpc.status.FAILED_PRECONDITION, 'Cart is not paid');

    if (!cart.products.some(product => product.productId === review.productId)) {
      throw new GRPCErrorHandler(grpc.status.FAILED_PRECONDITION, 'The user did not paid for the product');
    }

    const reviewFound = await reviewModel.findOne({ 
      where: { 
        userId: review.userId, 
        productId: review.productId 
      } 
    });
    if (reviewFound) throw new GRPCErrorHandler(grpc.status.ALREADY_EXISTS, 'Review already exists');
    
    const newReview = await reviewModel.create(review);
    await this.updateScore(review.productId);
    return newReview;
  }

  async update (review: IReviewModel, userId: string): Promise<IReviews> {
    const reviewFind = await reviewModel.findOne({ where: { userId, productId: review.productId } });
    if (!reviewFind) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Review not found');

    reviewFind.set(review);
    return await reviewFind.save();
  }

  async delete (reviewId: string): Promise<IReviews> {
    const review = await reviewModel.findByPk(reviewId);
    if (!review) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Review not found');

    await reviewModel.destroy({
      where: {
        id: reviewId
      }
    });

    await this.updateScore(review.productId);

    return review;
  }

  private async updateScore (productId: string) {
    const reviews = await reviewModel.findAll({
      where: { productId: productId }
    });
    
    const totalReviews = reviews.length;
    const sumOfScores = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageScore = totalReviews > 0 ? sumOfScores / totalReviews : 0;

    await ProductSchema.findOneAndUpdate({ id: productId }, { score: averageScore });
  }
}