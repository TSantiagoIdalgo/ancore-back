import { gql } from 'graphql-tag';

const userSchema = gql`
    type User {
        id: ID!
        userName: String!
        email: String!
        password: String!
        role: String!
        image: String
        verify: Boolean!
        ban: Boolean!
    }

    input UserInput {
        userName: String
        email: String
        password: String
        image: String
    }

    enum TLogin {
        Auth0
        Simple
    }

    input LoginInput {
        type: TLogin!
        email: String!
        password: String!
        image: String
    }

    extend type Query {
        getAllUsers: [User]!
        getUserById(userId: ID!): User!
        getUserLogin(loginInput: LoginInput!): String!
    }

    extend type Mutation {
        verifyUser(token: String!): User!
        createUser(user:  UserInput!): User!
        updateUser(userId: ID!, user: UserInput): User!
        deleteUser(userId: ID!): User!
        userBan(userId: ID!): User!
    }
`;

export default userSchema;