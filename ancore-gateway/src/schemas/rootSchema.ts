import { gql } from 'graphql-tag';
import userSchema from './user/userSchema';
import productSchema from './product/productSchema';

const rootSchema = gql`
    type Query {
        _: String
    }
    type Mutation {
        _: String
    }
`;

export const typeDefs = [rootSchema, userSchema, productSchema];