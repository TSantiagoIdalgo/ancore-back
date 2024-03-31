import ReviewCommandRepository from '../../models/review/reviewCommandRepository';
import GRPCErrorHandler from '../../helpers/error';
import * as grpc from '@grpc/grpc-js';
import { IReviewModel } from '../../types/reviews';

export default class ReviewCommandService {
  private readonly reviewCommandRepository: ReviewCommandRepository;

  constructor(reviewCommandRepository: ReviewCommandRepository) {
    this.reviewCommandRepository = reviewCommandRepository;
  }

  async createReview(review: IReviewModel) {
    try {
      return await this.reviewCommandRepository.create(review);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(500, 'Internal server error');
    }
  }

  async updateReview (review: IReviewModel, userId: string) {
    try {
      const reviewUpdate = await this.reviewCommandRepository.update(review, userId);
      if (!reviewUpdate) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Review not found');

      return reviewUpdate;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(500, 'Internal server error');
    }
  }

  async deleteReview (reviewId: string) {
    try {
      const reviewDelete = await this.reviewCommandRepository.delete(reviewId);
      if (!reviewDelete) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Review not found');

      return reviewDelete;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(500, 'Internal server error');
    }
  }
}