import ReviewCommandService from '../../services/reviewService/reviewCommandService';
import GRPCErrorHandler from '../../helpers/error';
import * as PT from '../../types/proto';
import * as grpc from '@grpc/grpc-js';


export default class ReviewCommandController {
  private readonly reviewCommandService: ReviewCommandService;

  constructor(reviewCommandService: ReviewCommandService) {
    this.reviewCommandService = reviewCommandService;
  }

  public async createReview (call: PT.TCreateReview, callback: PT.TCreateReviewResponse) {
    try {
      const review = call.request;
      if (!review.id || !review.userId) {
        throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Id and UserId are required');
      }

      const newReview = await this.reviewCommandService.createReview(review);
      callback(null, newReview);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(500, 'Internal server error');
    }
  }

  public async updateReview (call: PT.TUpdateReview, callback: PT.TUpdateReviewResponse) {
    try {
      const { userId, updateReview } = call.request;
      if (!userId) {
        throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'userId is required');
      }

      if (!updateReview) {
        throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Id is required');
      }

      const reviewUpdate = await this.reviewCommandService.updateReview(updateReview, userId);
      callback(null, reviewUpdate);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(500, 'Internal server error');
    }
  }

  public async deleteReview (call: PT.TDeleteReview, callback: PT.TDeleteReviewResponse) {
    try {
      const { reviewId } = call.request;
      if (!reviewId) {
        throw new GRPCErrorHandler(grpc.status.INVALID_ARGUMENT, 'Id is required');
      }

      const reviewDelete = await this.reviewCommandService.deleteReview(reviewId);
      callback(null, reviewDelete);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(500, 'Internal server error');
    }
  }
}