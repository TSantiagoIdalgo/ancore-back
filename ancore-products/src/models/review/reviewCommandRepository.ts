import { IReviewModel, IReviews } from '../../types/reviews';
import reviewModel from '../../database/sql/tables/reviewModel';
import GRPCErrorHandler from '../../helpers/error';
import * as grpc from '@grpc/grpc-js';

export default class ReviewCommandRepository {
  create (review: IReviewModel): Promise<IReviews> {
    return reviewModel.create(review);
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

    return review;
  }
}