import { gql } from 'graphql-tag';

const cartSchema = gql`
  type Cart {
    id: String
    userId: String
    total: Float
    products: [Product]
    isPaid: Boolean
  }

  enum ActionCart {
    add
    remove
    clear
  }

  extend type Query {
    getUserCart: Cart!
  }

  extend type Mutation {
    updateCart(action: ActionCart, productId: String!): Cart!
  }

  extend type Subscription {
    cartUpdated: Cart!
  }
`;

export default cartSchema;