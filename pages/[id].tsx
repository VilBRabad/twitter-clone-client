"use client"
import { useParams } from "next/navigation";
import React, { useCallback, useMemo } from "react"
import { IoMdArrowBack } from "react-icons/io";
import Image from "next/image";
import FeedCard from "@/components/FeedCard";
import { Post, User } from "@/gql/graphql";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { graphqlClient } from "@/client/api";
import { getUserByIdQuery } from "@/graphql/query/user";
import TwitterLayout from "@/components/TwitterLayout";
// import { FaRegCalendarAlt } from "react-icons/fa";
import { useCurrentUser } from "@/hooks/user";
import { followUserMutation, unFollowUserMutation } from "@/graphql/mutation/user";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface ServerProps {
    user?: User;
}

const UserPorfile: React.FC<ServerProps> = (props) => {
    // const params = useParams();
    // console.log(params.id);
    const {user} = useCurrentUser();
    const queryClient = useQueryClient();

    const amIFollowing = useMemo(() => {
        if (!props.user) return false;
        return (
          (user?.following?.findIndex(
            (el) => el?.id === props.user?.id
          ) ?? -1) >= 0
        );
      }, [user?.following, props.user]);


    const handleFollowButton = useCallback(async()=>{
        if(!props.user?.id) return;
        await graphqlClient.request(followUserMutation, {to: props.user?.id})

        queryClient.invalidateQueries({queryKey: ['current-user']});
        toast.success("Followed Successfully")
    }, [props.user?.id, queryClient]);
    
    
    const handleUnfollowButton = useCallback(async()=>{
        if(!props.user?.id) return;
        await graphqlClient.request(unFollowUserMutation, {to: props.user?.id});
        queryClient.invalidateQueries({queryKey: ['current-user']});
        toast.success("Unfollowed Successfully")
    }, [queryClient, props.user?.id])


    return (
        <TwitterLayout>
            <div className="relative">
                <div className="flex sticky top-0 items-center gap-4 px-3 py-2 backdrop-blur-md bg-black/60 z-50">
                    <Link href={"/"}>
                        <IoMdArrowBack size={20} />
                    </Link>
                    <div >
                        <h1 className="text-xl font-bold">Vilas Rabad</h1>
                        <p className="text-white/50 text-xs">{props.user?.posts?.length} Posts</p>
                    </div>
                </div>
                <div>
                    <div className="relative w-full h-[11rem] bg-slate-800 overflow-hidden">
                        <div className="absolute w-[5rem] h-[5rem] bg-[#1A8CD8]/10 top-4 left-4 rounded-full"></div>
                        <div className="absolute w-[2rem] h-[2rem] bg-[#1A8CD8]/30 top-4 left-4 rounded-full"></div>
                        <div className="absolute w-[10rem] h-[10rem] bg-[#1A8CD8]/10 -bottom-7 right-3 rounded-full"></div>
                        <div className="absolute w-[10rem] h-[10rem] bg-[#1A8CD8]/50 -bottom-6 -right-6 rounded-full"></div>
                    </div>
                    <div className="flex justify-between px-4 relative z-30">
                        <div>
                            {props.user?.profileImageURL ?
                                <Image
                                    src={props.user?.profileImageURL}
                                    alt="profile-image"
                                    width={140}
                                    height={140}
                                    className="rounded-full -mt-[48%] border-4 border-black"
                                />
                                :
                                <div className="h-[140px] w-[140px] -mt-[48%] rounded-full bg-gray-500 border-4 border-black overflow-hidden">
                                    <div className="animate-pulse w-full h-full bg-gray-700">
                                    </div>
                                </div>
                            }
                            {props.user?.firstName ?
                                <h1 className="text-xl font-bold mt-3">{props.user?.firstName} {props.user?.lastName}</h1>
                                :
                                <div className="mt-3 h-6 bg-gray-700 animate-pulse"></div>
                            }
                            {props.user?.email ?
                                <p className="text-white/50">@{props.user?.email.split("@")[0]}</p>
                                :
                                <div className="mt-1 h-5 w-[90%] bg-gray-700 animate-pulse"></div>
                            }
                        </div>
                        <div className="mt-3 flex flex-col justify-between">
                            <button className="border border-white/50 px-3 py-1 rounded-full font-semibold hover:bg-white/10">Edit profile</button>
                            {   
                                user?.id !== props.user?.id && (
                                    <>
                                        {
                                            amIFollowing ?
                                            <button onClick={handleUnfollowButton} className="bg-white text-black rounded-full px-2 py-1 mx-2 text-sm font-semibold hover:bg-white/80">Unfollow</button>
                                            :
                                            <button onClick={handleFollowButton} className="bg-white text-black rounded-full px-2 py-1 mx-2 text-sm font-semibold hover:bg-white/80">Follow</button>
                                        }
                                    </>
                                )
                            }
                        </div>
                    </div>
                    <div className="px-4 mt-3">
                        {/* {props.user?.email ?
                            <p className="text-white/80">Pursuing BTeach in Information Technology...</p>
                            :
                            <div className="h-6 w-[90%] bg-gray-700 animate-pulse"></div>
                        } */}
                        {/* {props.user?.email ?
                            <div className="mt-3 flex items-center text-white/50">
                                <FaRegCalendarAlt size={17} />
                                <p className="ml-1">Joined December 2021</p>
                            </div>
                            :
                            <div className="mt-3 h-6 w-[50%] bg-gray-700 animate-pulse"></div>
                        } */}
                        <div className="flex gap-6 text-sm mt-3">
                            {props.user?.email ?
                                <p>
                                    <span className="font-semibold">{props.user.following?.length}</span>
                                    <span className="text-white/50"> Following</span>
                                </p>
                                :
                                <div className="h-6 w-[8rem] bg-gray-700 animate-pulse"></div>
                            }
                            {props.user?.email ?
                                <p>
                                    <span className="font-semibold">{props.user.follower?.length}</span>
                                    <span className="text-white/50"> Followers</span>
                                </p>
                                :
                                <div className="h-6 w-[8rem] bg-gray-700 animate-pulse"></div>
                            }
                        </div>
                    </div> 
                    <div className="flex flex-col items-center justify-center border-b border-white/30 mt-6">
                        <p className="font-semibold p-2">Posts</p>
                        <div className="bg-[#1A8CD8] h-1 w-14"></div>
                    </div>
                    <div>
                        {
                            props.user?.posts ?
                                props.user.posts.map((post) => <FeedCard key={post?.id} data={post as Post} />)
                                :
                                <div className="w-full flex items-center justify-center">
                                    <h1 className="mt-6 text-2xl text-white/50 text-center font-bold w-[50%]">You do not have any posts</h1>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </TwitterLayout>
    )
}


export const getServerSideProps: GetServerSideProps<ServerProps> = async (context) => {
    const id = context.query.id as string | undefined;
    // console.log("Context id: ", id)

    if (!id) return { notFound: true, props: { user: undefined } }

    const userInfo = await graphqlClient.request(getUserByIdQuery, { id });

    if (!userInfo?.getUserById) return { notFound: true };

    return {
        props: {
            user: userInfo.getUserById as User,
        },
    }
}


export default UserPorfile;