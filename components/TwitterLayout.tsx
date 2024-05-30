"use client"
import React, { useCallback, useMemo } from "react";
import { CiCircleMore } from "react-icons/ci";
import { FaRegBookmark, FaXTwitter } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { IoNotificationsOutline, IoPeopleOutline, IoPersonOutline } from "react-icons/io5";
import { MdHomeFilled, MdOutlineMailOutline } from "react-icons/md";
import Image from "next/image";
import { IoIosMore } from "react-icons/io";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { GiFeather } from "react-icons/gi";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/user";
import { graphqlClient } from "@/client/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";

interface TwitterLayoutProps {
    children: React.ReactNode;
}

interface TwitterSidebarButton {
    title: String;
    icon: React.ReactNode;
    link: String;
}




const TwitterLayout: React.FC<TwitterLayoutProps> = (props) => {
    const { user } = useCurrentUser();
    const queryClient = useQueryClient();

    const handleSuccess = useCallback(async (response: CredentialResponse) => {
        // console.log(response);
        const googleToken = response.credential;
        if (!googleToken) return toast.error(`Google token not found!`);

        // console.log(window.localStorage.getItem("__twitter_token"));
        const data = await graphqlClient.request(
            verifyUserGoogleTokenQuery,
            { token: googleToken },
        );
        console.log(data);
        const verifyGoogleToken = data.verifyGoogleToken;

        // console.log(verifyGoogleToken);

        if (!verifyGoogleToken) return toast.error(`Google token not found!`);

        window.localStorage.setItem("__twitter_token", verifyGoogleToken);
        // console.log(verifyGoogleToken);

        await queryClient.invalidateQueries({ queryKey: ['current-user'] });
        return toast.success("Verified Success")
    }, [queryClient])


    const handleError = () => {
        return toast.error(`Server Error!`);
        // console.log('error');
    };


    const SidebarMenuItems: TwitterSidebarButton[]  = useMemo(()=>[
        {
            title: "Home",
            icon: <MdHomeFilled />,
            link: "/"
        },
        {
            title: "Explore",
            icon: <FiSearch />,
            link: "/"
        },
        {
            title: "Notifications",
            icon: <IoNotificationsOutline />,
            link: "/"
        },
        {
            title: "Messages",
            icon: <MdOutlineMailOutline />,
            link: "/"
        },
        {
            title: "Bookmark",
            icon: <FaRegBookmark />,
            link: "/"
        },
        {
            title: "Communities",
            icon: <IoPeopleOutline />,
            link: "/"
        },
        {
            title: "Profile",
            icon: <IoPersonOutline />,
            link: `${user?.id}`
        },
        {
            title: "More",
            icon: <CiCircleMore />,
            link: "/"
        }
    ], [user?.id])


    return (
        <div className="overflow-x-hidden flex justify-center">
            <div className="h-screen w-screen xl:w-[90rem] grid sm:grid-cols-20 sm:px-4 xl:px-36">
                <div className="relative col-span-2 lg:col-span-4 md:w-full pr-2 z-30">
                    <div className="fixed max-sm:w-full sm:sticky bottom-0 sm:top-0 pt-4 sm:h-screen">
                        <div className="h-full flex flex-col justify-between">
                            <div className="relative flex sm:flex-col max-sm:justify-around backdrop-blur-md bg-black/60">
                                <div className="hidden sm:block text-3xl hover:bg-white/10 transition-all w-fit p-3 rounded-full cursor-pointer">
                                    <FaXTwitter />
                                </div>
                                <ul className="flex sm:flex-col sm:gap-1 max-sm:justify-evenly max-sm:overflow-scroll">
                                    {
                                        SidebarMenuItems.map((item, index) => (
                                            <li key={index}>
                                                <Link href={`${item.link}`} className="flex items-center gap-2 text-lg mt-2 hover:bg-white/10 transition-all w-fit p-2 px-3 rounded-full cursor-pointer">
                                                    <span className="text-3xl sm:mr-2">{item.icon}</span>
                                                    <span className="hidden lg:block">{item.title}</span>
                                                </Link>
                                            </li>
                                        ))
                                    }
                                </ul>
                                <div className="mt-3 mr-5 max-lg:ml-1 max-sm:absolute bottom-14 right-0">
                                    <button className="bg-[#1A8CD8] hover:bg-[#1A8CD8]/90 transition-all p-3 lg:w-full rounded-full font-semibold flex items-center justify-center">
                                        <span className="hidden lg:block">Post</span>
                                        <GiFeather size={18} className="lg:hidden"/>
                                    </button>
                                </div>
                            </div>
                            <div className="relative mb-2 hidden sm:block">
                                {user &&
                                    <div className="w-full p-2 flex items-center justify-between rounded-full hover:bg-white/10 cursor-pointer">
                                        <div className="flex">
                                            {
                                                user && user.profileImageURL && (
                                                    <Image
                                                        className="rounded-full"
                                                        src={user.profileImageURL}
                                                        alt='profile-image'
                                                        width={43} height={43} />
                                                )
                                            }
                                            <div className='ml-3 hidden lg:block'>
                                                <h1 className="font-semibold">{user.firstName} {user.lastName}</h1>
                                                <p className="text-sm text-white/50">@{user.email.split("@")[0]}</p>
                                            </div>
                                        </div>
                                        <IoIosMore size={20} className="hidden lg:block"/>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-18 lg:col-span-16 w-full">
                    <div className="w-full flex flex-col-reverse md:grid sm:grid-cols-20">
                        <div className="relative sm:ml-2 sm:col-span-20 md:col-span-13 min-h-screen md:w-[97%] border-x border-white/30">
                            {props.children}
                        </div>
                        <div className="md:col-span-7 w-full relative">
                            <div className="lg:w-[95%] w-full sticky top-0 pt-2 max-md:flex justify-center">
                                <div className="hidden md:flex items-center px-4 bg-gray-800 rounded-full overflow-hidden">
                                    <FiSearch size={20} />
                                    <input type="text" placeholder="Search" className="w-full outline-0 bg-gray-800 p-3 px-4" />
                                </div>
                                {
                                    !user && (
                                        <div className="flex flex-col items-center md:block w-[95%] md:w-[100%] mt-4 h-auto border border-white/30 p-5 rounded-[1rem]">
                                            <h1 className="text-xl font-semibold mb-2">New to X?</h1>
                                            {/* <GoogleLoginClient /> */}
                                            <GoogleLogin
                                                onSuccess={handleSuccess}
                                                onError={handleError}
                                            />
                                        </div>
                                    )
                                }
                                <div className="hidden md:block w-[100%] mt-4 border border-white/30 p-5 rounded-[1rem]">
                                    <h1 className="text-xl font-semibold mb-2">Subscribe to Premium</h1>
                                    <p className='text-sm'>Subscribe to unlock new features and if eligible, receive a share of ads revenue.</p>
                                    <button className="bg-[#1A8CD8] hover:bg-[#1A8CD8]/90 transition-all p-2 px-6 mt-2 rounded-full text-sm font-semibold">Subscribe</button>
                                </div>
                                <div className="hidden md:block w-[100%] mt-4 border border-white/30 p-5 rounded-[1rem]">
                                    <h1 className="text-xl font-semibold mb-2">#What's Happening</h1>
                                    <p className='text-sm'>#Subscribe to unlock new features and if eligible, receive a share of ads revenue.</p>
                                    <p className='text-sm mt-4'>#o unlock new features and if eligible, receive a share of ads revenue.</p>
                                    <p className='text-sm mt-4'>#Subscrunlock new features and if eligible, receive a share of ads revenue.</p>
                                </div>
                                <div className="hidden md:flex w-full p-4 text-xs text-white/50 flex-wrap gap-1">
                                    <p className="hover:underline mr-2 text-nowrap cursor-pointer">Terms of Service</p>
                                    <p className="hover:underline mr-2 text-nowrap cursor-pointer">Privacy Policy</p>
                                    <p className="hover:underline mr-2 text-nowrap cursor-pointer">Cookie Policy</p>
                                    <p className="hover:underline mr-2 text-nowrap cursor-pointer">Accessibility</p>
                                    <p className="hover:underline mr-2 text-nowrap cursor-pointer">Ads info</p>
                                    <p className="hover:underline mr-2 text-nowrap cursor-pointer">More....</p>
                                    <p className="hover:underline mr-2 text-nowrap cursor-pointer">© 2024 X Corp.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default TwitterLayout;