import { IReviewModel, IReviews } from '../../types/reviews';
import reviewModel from '../../database/sql/tables/reviewModel';
import GRPCErrorHandler from '../../helpers/error';
import * as grpc from '@grpc/grpc-js';
import ProductSchema from '../../database/nosql/schemas/productsSchema';

export default class ReviewCommandRepository {
  async create (review: IReviewModel): Promise<IReviews> {
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
    const reviewFind = await reviewModel.findOne({ where: { userId, id: review.id } });
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