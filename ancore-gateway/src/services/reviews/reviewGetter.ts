import { ProductsReviews__Output } from '../../../proto/out/ProductsPackage/ProductsReviews';
import { Review__Output } from '../../../proto/out/ProductsPackage/Review';
import { Reviews__Output } from '../../../proto/out/ProductsPackage/Reviews';
import { ReviewsServiceClient } from '../../../proto/out/ProductsPackage/ReviewsService';
import { UserReviews__Output } from '../../../proto/out/ProductsPackage/UserReviews';
import GRPCErrorHandler from '../../helpers/error';

export default class ReviewGetter {
  private readonly client: ReviewsServiceClient;

  constructor(client: ReviewsServiceClient) {
    this.client = client;
  }

  public getReviews(): Promise<Reviews__Output> {
    return new Promise<Reviews__Output>((res, rej) => {
      this.client.getAllReviews({  }, (err, result) => {
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

  public getReview(reviewId: string): Promise<Review__Output> {
    return new Promise<Review__Output>((res, rej) => {
      this.client.getReviewById({ reviewId }, (err, result) => {
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

  public getProductReviews(productId: string): Promise<ProductsReviews__Output> {
    return new Promise<ProductsReviews__Output>((res, rej) => {
      this.client.getProductsReviews({ productId }, (err, result) => {
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

  public getUserReviews (userId: string): Promise<UserReviews__Output> {
    return new Promise<UserReviews__Output>((res, rej) => {
      this.client.getUserReviews({ userId }, (err, result) => {
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