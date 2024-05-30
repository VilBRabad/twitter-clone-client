import { graphqlClient } from "@/client/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getAllPostsQuery } from "@/graphql/query/post"
import { createPostMutation } from "@/graphql/mutation/post"
import { CreatePostData } from "@/gql/graphql"
import toast from "react-hot-toast"


export const useCreatePost = ()=>{
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (payload: CreatePostData)=> graphqlClient.request(createPostMutation, {payload}),
        onMutate: ()=> toast.loading("Creating Post", {id: "1"}),
        onSuccess: ()=> {
            queryClient.invalidateQueries({queryKey: ["all-posts"]});
            toast.success("Created successfully", {id: "1"});
        }
    })

    return mutation;
}


export const useGetAllPosts = ()=>{
    const query = useQuery({
        queryKey: ["all-posts"],
        queryFn: ()=> graphqlClient.request(getAllPostsQuery),
    })

    return {...query, posts: query.data?.getAllPosts}
}