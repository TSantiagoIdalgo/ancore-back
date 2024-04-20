import { gql } from 'graphql-tag';

const generalDataSchema = gql`
    type Banner {
        mainImage: String
        subImage: String
        productId: String
        name: String
        price: Int
        discount: Int
    }

    type Genre {
        id: String!
        genre: String!
    }

    input GenreInput {
        genre: String!
    }

    extend type Query {
        getAllBanners: [Banner]
        getBannerById(bannerId: String!): Banner!
        getAllGenres: [Genre]
        getGenreById(genreId: String!): Genre!
    }

    extend type Mutation {
        createGenre(genre: GenreInput): Genre!
        deleteGenre(genreId: String!): Genre
    }
`;

export default generalDataSchema;