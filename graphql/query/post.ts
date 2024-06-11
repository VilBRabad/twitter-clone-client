import { graphql } from "../../gql";

export const getAllPostsQuery = graphql(`
    query GetAllPosts{
        getAllPosts {
            id
            content
            imageURL
            author {
                id
                firstName
                lastName
                email
                profileImageURL
            }
        }
    }
`)


export const getPreSingedURLForPostQuery = graphql(`
    query GetPreSignedURL($imageType: String!) {
        getPreSignedURLForPost(imageType: $imageType)
    }
`)