import React from "react";
import Image from "next/image";
import { BiMessageRounded, BiRepost } from "react-icons/bi";
import { IoMdHeartEmpty } from "react-icons/io";
import { RiBarChartGroupedFill } from "react-icons/ri";
import { GoBookmark } from "react-icons/go";
import { FiUpload } from "react-icons/fi";
import { Post } from "@/gql/graphql";

interface PostDataProps{
    data: Post
}

const FeedCard: React.FC<PostDataProps> = ({data})=>{

    return <div className="">
        <div className="grid grid-cols-12 px-5 py-3 border-b border-white/20 hover:bg-white/5 transition-all">
            <div className="col-span-1">
                {data.author?.profileImageURL && <Image src={data.author?.profileImageURL} alt="user-image" height={45} width={45} className="rounded-full"/>}
            </div>
            <div className="col-span-11 ml-3">
                <div className="flex gap-1 items-center">
                    <h1 className="font-semibold">{data.author?.firstName} {data.author?.lastName}</h1>
                    <p className="text-white/30 text-sm">@{data.author?.email.split("@")[0]}</p>
                </div>
                <p className="text-sm mt-2">
                    {data.content}
                </p>
                {data.imageURL &&
                    <Image 
                        src={data.imageURL}
                        alt="post-image"
                        width={100}
                        height={100}
                    />
                }
                <div className="flex w-full justify-between mt-2">
                    <div className="text-white/50 hover:text-sky-400 flex items-center -ml-2 cursor-pointer">
                        <div className="hover:bg-sky-400/10 transition-all p-2 rounded-full">
                            <BiMessageRounded size={19}/>
                        </div>
                        <span className="text-xs transition-all font-extralight -ml-1">16</span>
                    </div>
                    <div className="text-white/50 hover:text-green-400 flex items-center cursor-pointer">
                        <div className="hover:bg-green-400/10 transition-all p-2 rounded-full">
                            <BiRepost size={19}/>
                        </div>
                        <span className="text-xs transition-all font-extralight -ml-1">5</span>
                    </div>
                    <div className="text-white/50 hover:text-pink-500 flex items-center cursor-pointer">
                        <div className="hover:bg-pink-500/10 transition-all p-2 rounded-full">
                            <IoMdHeartEmpty size={19}/>
                        </div>
                        <span className="text-xs transition-all font-extralight -ml-1">21</span>
                    </div>
                    <div className="text-white/50 hover:text-sky-400 flex items-center cursor-pointer">
                        <div className="hover:bg-sky-400/10 transition-all p-2 rounded-full">
                            <RiBarChartGroupedFill size={19}/>
                        </div>
                        <span className="text-xs transition-all font-extralight -ml-1">81k</span>
                    </div>
                    <div className="text-white/50 flex items-center cursor-pointer">
                        <div className="hover:bg-sky-400/10 hover:text-sky-400 transition-all p-2 rounded-full">
                            <GoBookmark size={19}/>
                        </div>
                        <div className="hover:bg-sky-400/10 hover:text-sky-400 transition-all p-2 rounded-full">
                            <FiUpload size={19}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default FeedCard
