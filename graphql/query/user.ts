import { graphql } from "../../gql";

export const verifyUserGoogleTokenQuery = graphql(`
  query VerifyUserGoogleToken($token: String!) {
    verifyGoogleToken(token: $token)
  }
`);


export const getCurrentUserQuery = graphql(`
   query GetCurrentUser {
    getCurrentUser {
      id
      email
      profileImageURL
      firstName
      lastName
      posts{
        id
        content
        imageURL
        author{
          id
          firstName
          lastName
          email
          profileImageURL
        }
      }
    }
  }
`);


export const getUserByIdQuery = graphql(`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      firstName
      lastName
      email
      profileImageURL
      posts {
        id
        content
        imageURL
        author {
          id
          email
          firstName
          lastName
          profileImageURL
        }
      }
    }
  }
`)
