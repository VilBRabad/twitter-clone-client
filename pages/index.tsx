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
import { useCreatePost, useGetAllPosts } from "@/hooks/post";
import TwitterLayout from "@/components/TwitterLayout";
import { GetServerSideProps } from "next";
import { graphqlClient } from "@/client/api";
import { getAllPostsQuery, getPreSingedURLForPostQuery } from "@/graphql/query/post";
import toast from "react-hot-toast";
import axios from "axios";

interface HomeProps{
  posts?: Post[];
}

export default function Home(props: HomeProps) {
  const { user } = useCurrentUser();
  const { posts = props.posts as Post[] } = useGetAllPosts();
  const { mutateAsync } = useCreatePost();

  const [content, setContent] = useState("");
  const [uploadImage, setUploadImage] = useState("");

  const handleCreatePost = useCallback(async() => {
    await mutateAsync({
      content,
      imageURL: uploadImage
    });
    setContent("");
    setUploadImage("");
  }, [content, mutateAsync, uploadImage]);


  const handleEmojiPanal = ()=>{
    return "";
  }


  const handleInputChangeFile = useCallback((input: HTMLInputElement)=>{
    return async(event: Event)=> {
      event.preventDefault();
      
      const file: File | undefined | null = input.files?.item(0);
      if(!file) return;

      console.log(file);

      // setSelectImage(file);

      const {getPreSignedURLForPost} = await graphqlClient.request(getPreSingedURLForPostQuery, {imageType: file.type});

      if(getPreSignedURLForPost){
        toast.loading("Uploading...", {id: "2"});
        await axios.put(getPreSignedURLForPost, file, {
          headers: {
            "Content-Type": file.type,
          }
        })

        const url = new URL(getPreSignedURLForPost);

        const imageUrl = `${url.origin}${url.pathname}`;
        setUploadImage(imageUrl);
        toast.success("Upload Completed", {id: "2"});
      }
    }
  }, [])

  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    const handlerFn = handleInputChangeFile(input);
    input.addEventListener("change", handlerFn);

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
          posts?.length !== 0 ?
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
                      {
                        uploadImage &&
                          <Image
                            src={uploadImage}
                            alt="upload image"
                            width={1000}
                            height={1000}
                            className="w-full mb-2 rounded-md"
                          />
                      }
                      <div className="flex items-center justify-between">
                        <div className="flex">
                          <div className="hover:bg-[#1A8CD8]/10 transition-all p-2 rounded-full cursor-pointer">
                            <FiImage size={19} onClick={handleSelectImage} className="text-[#1A8CD8]" />
                          </div>
                          <div className="hover:bg-[#1A8CD8]/10 transition-all p-2 rounded-full cursor-pointer">
                            <BsEmojiSmile onClick={handleEmojiPanal} size={19} className="text-[#1A8CD8]" />
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
                  posts?.map((post) => post ? <FeedCard key={post?.id} data={post as Post} /> : "")
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


export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  context
) => {

  const allPosts = await graphqlClient.request(getAllPostsQuery);
  if(!allPosts) return{
    props: {
      posts: [],
    }
  }
  return {
    props: {
      posts: allPosts.getAllPosts as Post[],
    },
  };
};


