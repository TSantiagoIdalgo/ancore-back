import { gql } from 'graphql-tag';
import userSchema from './user/userSchema';
import productSchema from './product/productSchema';
import reviewSchema from './review/reviewSchema';
import cartSchema from './cart/cartSchema';
import whitelistSchema from './whitelist/whitelistSchema';
import generalDataSchema from './generalData/generalDataSchema';

const rootSchema = gql`
    type Query {
        _: String
    }
    type Mutation {
        _: String
    }
    type Subscription {
        _: String
    }
`;

export const typeDefs = [
  rootSchema, userSchema, productSchema, 
  reviewSchema, cartSchema, whitelistSchema,
  generalDataSchema
];