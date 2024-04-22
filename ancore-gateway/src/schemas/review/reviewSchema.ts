import { gql } from 'graphql-tag';

const reviewSchema = gql`
  type Review {
    id: String
    userId: String
    productId: String
    rating: Float
    title: String
    comment: String
  }

  input ReviewInput {
    productId: String
    rating: Float
    title: String
    comment: String
  }

  type UserReviews {
    userProduct: Product
    userReviews: Review
  }

  extend type Query {
    getAllReviews: [Review]
    getReviewById(reviewId: String!): Review
    getProductReviews(productId: String!): [Review]
    getUserReviews: [UserReviews]
  }

  extend type Mutation {
    createReview(review: ReviewInput!): Review
    updateReview(review: ReviewInput!): Review
    deleteReview(reviewId: String!): Review
  }
`;

export default reviewSchema;