import { IReviewModel } from '../../types/reviews/reviews';
import { GraphQLError } from 'graphql';
import { ErrorDefs } from '../../types/error';
import ReviewGetter from './reviewGetter';
import ReviewSetter from './reviewSetter';
import GRPCErrorHandler from '../../helpers/error';
import { reviewValidate, optionalReviewValidate } from '../../helpers/validates/reviewValidate';

export default class ReviewService {
  private readonly reviewGetter: ReviewGetter;
  private readonly reviewSetter: ReviewSetter;

  constructor (reviewGetter: ReviewGetter, reviewSetter: ReviewSetter) {
    this.reviewGetter = reviewGetter;
    this.reviewSetter = reviewSetter;
  }

  async getAllReviews () {
    try {
      const reviews = await this.reviewGetter.getReviews();
      if (!reviews.reviews) throw new GRPCErrorHandler(404, ErrorDefs.NOT_FOUND);

      if (reviews.reviews.length === 0) throw new GRPCErrorHandler(404, ErrorDefs.NOT_FOUND);

      return reviews;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }

  async getReview (reviewId: string) {
    try {
      if (!reviewId) throw new GRPCErrorHandler(400, ErrorDefs.BAD_REQUEST);

      const review = await this.reviewGetter.getReview(reviewId);
      if (!review) throw new GRPCErrorHandler(404, ErrorDefs.NOT_FOUND);

      return review;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }

  async getProductReviews (productId: string) {
    try {
      if (!productId) throw new GRPCErrorHandler(400, ErrorDefs.BAD_REQUEST);

      const reviews = await this.reviewGetter.getProductReviews(productId);
      if (!reviews) throw new GRPCErrorHandler(404, ErrorDefs.NOT_FOUND);

      return reviews.Reviews;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }

  async getUserReviews (userId: string) {
    try {
      if (!userId) throw new GRPCErrorHandler(400, ErrorDefs.BAD_REQUEST);

      const reviews = await this.reviewGetter.getUserReviews(userId);
      if (!reviews.userReviews) throw new GRPCErrorHandler(404, ErrorDefs.NOT_FOUND);

      return reviews.userReviews;
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }

  async createReview (review: IReviewModel) {
    try {
      const validateReview = reviewValidate.parse(review);
      return await this.reviewSetter.createReview(validateReview);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }

  async updateReview (userId: string, review: IReviewModel) {
    try {
      if (!userId) throw new GRPCErrorHandler(400, ErrorDefs.BAD_REQUEST);
      const reviewValidate = optionalReviewValidate.parse(review);

      return await this.reviewSetter.updateReview(userId, reviewValidate);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }

  async deleteReview (reviewId: string) {
    try {
      if (!reviewId) throw new GRPCErrorHandler(400, ErrorDefs.INVALID_INPUT);

      return await this.reviewSetter.deleteReview(reviewId);
    } catch (error) {
      if (error instanceof GRPCErrorHandler) {
        throw new GraphQLError(error.message, { extensions: { code: error.name }});
      } else if (error instanceof Error) {
        throw new GraphQLError(error.message, { extensions: { code: 400 } });
      } else throw new GraphQLError(ErrorDefs.INTERNAL_ERROR, { extensions: { code: 500 } });
    }
  }
}