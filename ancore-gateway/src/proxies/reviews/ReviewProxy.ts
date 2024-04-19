import { ServerContext } from '../../types/serverTypes';
import { GraphQLError } from 'graphql';
import { ErrorDefs } from '../../types/error';
import ReviewService from '../../services/reviews/reviewService';
import GRPCErrorHandler from '../../helpers/error';
import { IReviewModel } from '../../types/reviews/reviews';

export default class ReviewProxy {
  private readonly reviewService: ReviewService;

  constructor(reviewService: ReviewService) {
    this.reviewService = reviewService;
  }

  public async getAllReviews() {
    try {
      const reviews = await this.reviewService.getAllReviews();
      if (!reviews || !reviews.reviews || reviews.reviews.length === 0) {
        throw new GRPCErrorHandler(404, ErrorDefs.NOT_FOUND);
      }

      return reviews.reviews;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }

  public async getReviewById (reviewId: string) {
    try {
      if (!reviewId) throw new GRPCErrorHandler(400, ErrorDefs.BAD_REQUEST);

      const review = await this.reviewService.getReview(reviewId);
      if (!review) throw new GRPCErrorHandler(404, ErrorDefs.NOT_FOUND);

      return review;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }

  public async getProductReviews (productId: string) {
    try {
      if (!productId) throw new GRPCErrorHandler(400, ErrorDefs.BAD_REQUEST);

      const reviews = await this.reviewService.getProductReviews(productId);
      if (!reviews) throw new GRPCErrorHandler(404, ErrorDefs.NOT_FOUND);

      return reviews;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }

  public async getUserReview (context: ServerContext) {
    try {
      const userId = context.decodedToken;
      if (!userId) throw new GRPCErrorHandler(401, ErrorDefs.UNAUTHORIZED);

      const reviews = await this.reviewService.getUserReviews(userId);
      if (!reviews) throw new GRPCErrorHandler(404, ErrorDefs.NOT_FOUND);

      return reviews;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }
  
  public async createReview (context: ServerContext, review: IReviewModel) {
    try {
      const userId = context.decodedToken;
      if (!userId) throw new GRPCErrorHandler(401, ErrorDefs.UNAUTHORIZED);
      return await this.reviewService.createReview({ ...review, userId });
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }

  public async updateReview (context: ServerContext, review: IReviewModel) {
    try {
      const userId = context.decodedToken;
      if (!userId) throw new GRPCErrorHandler(401, ErrorDefs.UNAUTHORIZED);

      return await this.reviewService.updateReview(userId, review);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }

  public async deleteReview (context: ServerContext, reviewId: string) {
    try {
      const userId = context.decodedToken;
      if (!userId) throw new GRPCErrorHandler(401, ErrorDefs.UNAUTHORIZED);

      return await this.reviewService.deleteReview(reviewId);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.code } });
      } else if (error instanceof GraphQLError) {
        throw new GraphQLError(error.message, { extensions: { code: error.extensions.code } });
      } throw new GraphQLError(ErrorDefs.INTERNAL_ERROR);
    }
  }
}