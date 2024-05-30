"use client"
import FeedCard from "@/components/FeedCard";
import { useCurrentUser } from "@/hooks/user";
import Image from 'next/image';
import { FiImage } from "react-icons/fi";
import { BsEmojiSmile } from "react-icons/bs";
import { RiFileGifLine } from "react-icons/ri";
import { Post } from '@/gql/graphql';
import { IoMdRefresh } from 'react-icons/io';
import { useCallback, useState } from "react";
import { useCreatePost } from "@/hooks/post";
import TwitterLayout from "@/components/TwitterLayout";
import { GetServerSideProps } from "next";
import { graphqlClient } from "@/client/api";
import { getAllPostsQuery } from "@/graphql/query/post";

interface HomeProps{
  posts?: Post[];
}

export default function Home<HomeProps>(props: HomeProps) {
  const { user } = useCurrentUser();

  const { mutate } = useCreatePost();

  const [content, setContent] = useState("");

  const handleCreatePost = useCallback(() => {
    mutate({
      content,
    });
    setContent("");
  }, [content, mutate]);


  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
  }, []);


  const handleRefreshClick = () => {
    window.location.reload();
  }


  return (
    <>
      <TwitterLayout>
        <div className="nav flex items-center justify-center sticky top-0 h-[3.2rem] border-b border-white/20 backdrop-blur-md bg-black/60 z-10">
          <div className="relative w-[50%] h-full hover:bg-white/10 cursor-pointer">
            <div className="flex items-center justify-center w-full h-full">
              <p className="font-semibold">For You</p>
            </div>
            <div className="absolute h-[4px] w-[3.5rem] bg-blue-400 right-[40.6%] bottom-0 rounded-full"></div>
          </div>
          <div className="w-[50%] h-full hover:bg-white/10 cursor-pointer">
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-sm text-white/50">Following</p>
            </div>
          </div>
        </div>
        {
          props.posts?.length !== 0 ?
            <>
              {user &&
                <div>
                  <div className="grid grid-cols-12 px-5 py-3 border-b border-white/20 hover:bg-white/5 transition-all">
                    <div className="col-span-1">
                      {user?.profileImageURL &&
                        <Image
                          className="rounded-full"
                          src={user?.profileImageURL}
                          alt="profile-image"
                          height={45} width={45} />
                      }
                    </div>
                    <div className="col-span-11 ml-2">
                      <textarea
                        rows={1}
                        className="bg-transparent p-1 py-3 w-full text-lg outline-0 border-b border-white/30"
                        placeholder="What's Happening?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      ></textarea>
                      <div className="flex items-center justify-between">
                        <div className="flex">
                          <div className="hover:bg-[#1A8CD8]/10 transition-all p-2 rounded-full cursor-pointer">
                            <FiImage size={19} onClick={handleSelectImage} className="text-[#1A8CD8]" />
                          </div>
                          <div className="hover:bg-[#1A8CD8]/10 transition-all p-2 rounded-full cursor-pointer">
                            <BsEmojiSmile size={19} className="text-[#1A8CD8]" />
                          </div>
                          <div className="hover:bg-[#1A8CD8]/10 transition-all p-2 rounded-full cursor-pointer">
                            <RiFileGifLine size={19} className="text-[#1A8CD8]" />
                          </div>
                        </div>
                        <div>
                          <button onClick={handleCreatePost} className={`bg-[#1A8CD8] transition-all ${content !== "" ? "hover:bg-[#1A8CD8]/80" : "opacity-50"} font-semibold p-2 text-sm px-5 rounded-full`}>Post</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>}
              <div>
                {
                  props.posts?.map((post: Post) => post ? <FeedCard key={post?.id} data={post as Post} /> : "")
                }
              </div>
            </>
            :
            <div className="w-full h-full flex items-center justify-center">
              <div onClick={handleRefreshClick} className="flex flex-col items-center ">
                <IoMdRefresh size={30} className="text-[#1A8CD8] cursor-pointer" />
                <p className="text-white/60 cursor-pointer">Server Error, Please Try Again</p>
              </div>
            </div>
        }
      </TwitterLayout>
    </>
  );
}


export const getServerSideProps:GetServerSideProps<HomeProps> = async(context)=>{
  const allPosts = await graphqlClient.request(getAllPostsQuery);

  // if(!allPosts?.getAllPosts) return {notFound: true, props: {posts: null}};

  return {
    props:{
      posts: allPosts?.getAllPosts as Post[],
    }
  }
}


