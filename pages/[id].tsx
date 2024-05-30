"use client"
import { useParams } from "next/navigation";
import React from "react"
import { IoMdArrowBack } from "react-icons/io";
import Image from "next/image";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useCurrentUser } from "@/hooks/user";
import FeedCard from "@/components/FeedCard";
import { Post } from "@/gql/graphql";
import Link from "next/link";
import { GetServerSideProps } from "next";

const UserPorfile: React.FC = ()=>{
    const {user} = useCurrentUser();
    
    const params = useParams();
    console.log(params.id);

    return (
        <div className="relative">
            <div className="flex sticky top-0 items-center gap-4 p-3 backdrop-blur-md bg-black/60 z-10">
                <Link href={"/"}>
                    <IoMdArrowBack size={20}/>
                </Link>
                <h1 className="text-lg font-bold">Vilas Rabad</h1>
            </div>
            <div>
                <div className="w-full">
                    <Image 
                        src={"https://pbs.twimg.com/profile_banners/1468178178803789831/1692189636/1080x360"}    
                        alt="backgrround-image"
                        width={100}
                        height={100}
                        className="w-full"
                    />
                </div>
                <div className="flex justify-between px-4">
                    <div>
                        {user?.profileImageURL ? 
                            <Image 
                                src={user?.profileImageURL}
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
                        {user?.firstName?
                            <h1 className="text-xl font-bold mt-3">{user?.firstName} {user?.lastName}</h1>
                            :
                            <div className="mt-3 h-6 bg-gray-700 animate-pulse"></div>
                        }
                        {user?.email?
                            <p className="text-white/50">@{user?.email.split("@")[0]}</p>
                            :
                            <div className="mt-1 h-5 w-[90%] bg-gray-700 animate-pulse"></div>
                        }
                    </div>
                    <div className="mt-3">
                        <button className="border border-white/50 px-3 py-1 rounded-full font-semibold hover:bg-white/10">Edit profile</button>
                    </div>
                </div>
                <div className="px-4 mt-3">
                    {user?.email?
                        <p className="text-white/80">Pursuing BTeach in Information Technology...</p>
                        :
                        <div className="h-6 w-[90%] bg-gray-700 animate-pulse"></div>
                    }
                    {user?.email?
                        <div className="mt-3 flex items-center text-white/50">
                            <FaRegCalendarAlt size={17}/>
                            <p className="ml-1">Joined December 2021</p>
                        </div>
                        :
                        <div className="mt-3 h-6 w-[50%] bg-gray-700 animate-pulse"></div>
                    }
                    <div className="flex gap-6 text-sm mt-3">
                        {user?.email?
                            <p>
                                <span className="font-semibold">16</span> 
                                <span className="text-white/50"> Following</span>
                            </p>
                            :
                            <div className="h-6 w-[8rem] bg-gray-700 animate-pulse"></div>
                        }
                        {user?.email?
                            <p>
                                <span className="font-semibold">9</span> 
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
                        user?.posts?
                            user.posts.map((post)=> <FeedCard key={post?.id} data={post as Post}/>)
                        :
                        <div className="w-full flex items-center justify-center">
                            <h1 className="mt-6 text-2xl text-white/50 text-center font-bold w-[50%]">You do not have any posts</h1>
                        </div>
                    }
                </div>
            </div>

        </div>
    )
}


// export const getServerSideProps: GetServerSideProps = async(context)=>{
//     const id = context.query.id;
//     console.log("Context id: ", id)

//     return {
//         props: {},
//     }
// }


export default UserPorfile;