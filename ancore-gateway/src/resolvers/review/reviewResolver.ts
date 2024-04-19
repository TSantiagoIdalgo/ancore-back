import { reviewClient } from '../../config/clients';
import ReviewGetter from '../../services/reviews/reviewGetter';
import ReviewSetter from '../../services/reviews/reviewSetter';
import ReviewService from '../../services/reviews/reviewService';
import ReviewProxy from '../../proxies/reviews/ReviewProxy';
import { ServerContext } from '../user/userResolverTypes';
import { IReviewModel } from '../../types/reviews/reviews';

const reviewGetters = new ReviewGetter(reviewClient);
const reviewSetters = new ReviewSetter(reviewClient);
const reviewService = new ReviewService(reviewGetters, reviewSetters);
const reviewProxy = new ReviewProxy(reviewService);

interface ReveiwId {
    reviewId: string;
}

interface ProductId {
    productId: string;
}

const reviewResolver = {
  Query: {
    getAllReviews: async () =>
      await reviewProxy.getAllReviews(),
    getReviewById: async (_root: ReveiwId, args: ReveiwId) =>
      await reviewProxy.getReviewById(args.reviewId),
    getProductReviews: async (_root: ProductId, args: ProductId) =>
      await reviewProxy.getProductReviews(args.productId),
    getUserReviews: async (_root: unknown, _args: unknown, context: ServerContext) =>
      await reviewProxy.getUserReview(context)
  },
  Mutation: {
    createReview: async (_root: IReviewModel, args: IReviewModel, context: ServerContext) =>
      await reviewProxy.createReview(context, args),
    updateReview: async (_root: IReviewModel, args: IReviewModel, context: ServerContext) =>
      await reviewProxy.updateReview(context, args),
    deleteReview: async (_root: ReveiwId, args: ReveiwId, context: ServerContext) =>
      await reviewProxy.deleteReview(context, args.reviewId)
  }
};

export default reviewResolver;