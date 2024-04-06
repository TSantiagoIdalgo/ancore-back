import { gql } from 'graphql-tag';

const rootSchema = gql`
    type Query {
        _: String
    }
    type Mutation {
        _: String
    }
`;

export const typeDefs = [rootSchema];