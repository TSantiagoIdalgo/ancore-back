import { Review__Output } from '../../../proto/out/ProductsPackage/Review';
import { ReviewsServiceClient } from '../../../proto/out/ProductsPackage/ReviewsService';
import GRPCErrorHandler from '../../helpers/error';
import { IReviewModel } from '../../types/reviews/reviews';

export default class ReviewSetter {
  private readonly client: ReviewsServiceClient;

  constructor(client: ReviewsServiceClient) {
    this.client = client;
  }

  public createReview(review: IReviewModel): Promise<Review__Output> {
    return new Promise<Review__Output>((res, rej) => {
      this.client.createReview(review, (err, result) => {
        if (err || !result) {
          if (!err?.code) {
            rej(err);
            return;
          }
          rej(new GRPCErrorHandler(err.code, err.message, err.details));
          return;
        }
        res(result);
      });
    });
  }

  public updateReview(userId: string, review: IReviewModel): Promise<Review__Output> {
    return new Promise<Review__Output>((res, rej) => {
      this.client.updateReview({ userId, updateReview: review }, (err, result) => {
        if (err || !result) {
          if (!err?.code) {
            rej(err);
            return;
          }
          rej(new GRPCErrorHandler(err.code, err.message, err.details));
          return;
        }
        res(result);
      });
    });
  }

  public deleteReview(reviewId: string): Promise<Review__Output> {
    return new Promise<Review__Output>((res, rej) => {
      this.client.deleteReview({ reviewId }, (err, result) => {
        if (err || !result) {
          if (!err?.code) {
            rej(err);
            return;
          }
          rej(new GRPCErrorHandler(err.code, err.message, err.details));
          return;
        }
        res(result);
      });
    });
  }
}