import { gql } from 'graphql-tag';

const whitelistSchema = gql`
    type Whitelist {
        id: String
        userId: String
        productId: String
        products: [Product]
    }

    extend type Query {
        getUserWhitelist: [Product]
    }

    enum AddOrRemove {
        add
        remove
    }

    extend type Mutation {
        addOrRemoveProduct(productId: String!, action: AddOrRemove!): Whitelist
    }
`;

export default whitelistSchema;