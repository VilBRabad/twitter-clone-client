import { graphql } from "@/gql";

export const createPostMutation = graphql(`#graphql
    mutation Mutation($payload: CreatePostData!) {
        createPost(payload: $payload) {
            id
        }
    }
`);