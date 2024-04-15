import { gql } from 'graphql-tag';

const productSchema = gql`
    scalar Trailer
    scalar MainImage
    scalar Images

    type Product {
        id: String
        name: String
        price: Float
        stock: Int
        discount: Float
        disabled: Boolean
        platform: String
        score: Float
        distributor: String
        developer: String
        genre: String
        description: String
        trailer: String
        mainImage: String
        images: [String]
        amount: Int
    }

    input ProductInput {
        name: String
        price: Float
        stock: Int
        discount: Float
        disabled: Boolean
        platform: String
        distributor: String
        developer: String
        genre: String
        description: String
    }

    extend type Query {
        getAllProducts(page: Int, size: Int): [Product!]!
        getProductById(productId: String!): Product
        getTotalPages(size: Int): Int!
    }

    extend type Mutation {
        updateProduct(productId: String!, product: ProductInput): Product
        deleteProduct(productId: String!): Product
    }
`;

export default productSchema;