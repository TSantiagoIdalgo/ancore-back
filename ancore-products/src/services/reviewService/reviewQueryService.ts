import ReviewQueryRepository from '../../models/review/reviewQueryRepository';
import ProductQueryRepository from '../../models/products/productQueryRepository';
import GRPCErrorHandler from '../../helpers/error';
import * as grpc from '@grpc/grpc-js';

export default class ReviewQueryService {
  private readonly reviewQueryRepository: ReviewQueryRepository;
  private readonly productQueryRepository: ProductQueryRepository;

  constructor(reviewQueryRepository: ReviewQueryRepository, productQueryRepository: ProductQueryRepository) {
    this.reviewQueryRepository = reviewQueryRepository;
    this.productQueryRepository = productQueryRepository;
  }

  public async getReviews() {
    try {
      const reviews = await this.reviewQueryRepository.getAll();

      if (reviews.length === 0) {
        throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Reviews not found');
      }
      return reviews;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(500, 'Internal server error');
    }
  }

  public async getReview(id: string) {
    try {
      const review = await this.reviewQueryRepository.getById(id);

      if (!review) {
        throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Review not found');
      }
      return review;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(500, 'Internal server error');
    }
  }

  public async getProductsReviews (productId: string) {
    try {
      const product = await this.productQueryRepository.getById(productId);
      if (!product) throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'Product not found');

      const productReviews = await this.reviewQueryRepository.getProductReviews(productId);
      if (productReviews.reviews.length === 0) {
        throw new GRPCErrorHandler(grpc.status.NOT_FOUND, 'The product has no reviews');
      }

      return productReviews;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(500, 'Internal server error');
    }
  }

  public async getUserReviews (userId: string) {
    try {
      return await this.reviewQueryRepository.getUsersReview(userId);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) throw new GRPCErrorHandler(error.code, error.message);
      else throw new GRPCErrorHandler(500, 'Internal server error');
    }
  }
}