import GRPCErrorHandler from '../../helpers/error';
import ReviewQueryService from '../../services/reviewService/reviewQueryService';
import * as PT from '../../types/proto';
import * as grpc from '@grpc/grpc-js';

export default class ReviewQueryController {
  private readonly reviewQueryService: ReviewQueryService;

  constructor (reviewQueryService: ReviewQueryService) {
    this.reviewQueryService = reviewQueryService;
  }

  public async getAllReviews (_call: PT.TGetAllReviews, callback: PT.TGetAllReviewsResponse) {
    try {
      const reviews = await this.reviewQueryService.getReviews();

      if (reviews.length === 0) {
        throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Reviews not found');
      }
      
      callback(null, { reviews });
    } catch (error) {
      if (error instanceof GRPCErrorHandler) callback(error);
      else callback(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }

  public async getReviewById (call: PT.TGetReviewById, callback: PT.TGetReviewByIdResponse) {
    try {
      const { reviewId } = call.request;

      if (!reviewId) {
        throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Review id is required');
      }
      const review = await this.reviewQueryService.getReview(reviewId);

      if (!review) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Review not found');
      
      callback(null, review);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) callback(error);
      else callback(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }

  public async getProductReviews (call: PT.TGetProductReviews, callback: PT.TGetProductReviewsResponse) {
    try {
      const { productId } = call.request;

      if (!productId) {
        throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Product id is required');
      }

      const productReviews = await this.reviewQueryService.getProductsReviews(productId);

      if (productReviews.reviews.length === 0) {
        throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'The product has no reviews');
      }

      callback(null, { productReviews });
    } catch (error) {
      if (error instanceof GRPCErrorHandler) callback(error);
      else callback(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }

  public async getUserReviews (call: PT.TGetUserReviews, callback: PT.TGetUserReviewsResponse) {
    try {
      const { userId } = call.request;
      if (!userId) {
        throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'User id is required');
      }

      const userReviews = await this.reviewQueryService.getUserReviews(userId);
      
      if (userReviews.length === 0) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'User has no reviews');

      callback(null, { userReviews });
    } catch (error) {
      if (error instanceof GRPCErrorHandler) callback(error);
      else callback(new GRPCErrorHandler(grpc.status.INTERNAL, 'Internal server error'), {});
    }
  }
}