"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import NoDp from "@/assets/images/iamge8.jpg";
import HighlightHashtags from "./highlightHashtags";
import { Post } from "@/lib/types";
import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { RxCross2 } from "react-icons/rx";
import { formatPostDate } from "@/lib/helpers-utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ShareModal from "./ShareModal";
import { FaHeart, FaLocationArrow } from "react-icons/fa";

const FeedPostsList = ({
  posts,
  onLike,
}: {
  posts: Post[];
  onLike: (postId: string) => void;
}) => {
  const router = useRouter();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  useEffect(() => {
    if (shareModalOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling
    }

    return () => {
      document.body.style.overflow = "auto"; // Clean up when the component unmounts or modal is closed
    };
  }, [shareModalOpen]);
  return (
    <div className="w-full bg-red-40">
      <h2 className="text-2xl font-bold mt-5">Feeds</h2>
      <div className="w-full mt-4">
        {posts.map((post, i: number) => (
          <div key={i} className="rounded-2xl h-auto p-4 bg-purple-100 mb-4">
            <div
              className="flex w-fit cursor-pointer gap-4 "
              onClick={() => router.push(`/profile/${post.user_id}`)}
            >
              <div className="relative w-[50px] h-[50px]">
                <Image
                  src={NoDp}
                  alt="userImage"
                  sizes="50px"
                  priority
                  style={{ objectFit: "cover" }}
                  fill
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-base text-black font-semibold tracking-normal capitalize">
                  {post.userName?.display_name && post.userName?.display_name}
                </span>
                <span className="text-xs font-normal text-gray-400 tracking-wide">
                  {post.created_at
                    ? formatPostDate(post.created_at)
                    : "Just Now"}
                </span>
              </div>
            </div>

            {/* Hashtags */}
            <div className="my-2">
              <HighlightHashtags text={post.text || ""} />
            </div>
            {/* Post Carousel */}
            <Carousel className="w-full max-w-[500px]">
              <CarouselContent>
                {post.image_urls &&
                  post.image_urls.length > 0 &&
                  post.image_urls.map((imageUrl, index) => (
                    <CarouselItem
                      key={`imageakjsbdn-${post.id}-${index}`}
                      className="relative w-full h-[260px] rounded-xl"
                    >
                      <Image
                        src={imageUrl}
                        alt={`Post image ${index}`}
                        width={300}
                        height={200}
                        className="object-cover w-full h-full rounded-xl bg-black"
                        priority
                      />
                      {(post.image_urls?.length || 0) +
                        (post.video_url ? 1 : 0) >
                        1 && (
                        <div className="px-2 py-1 absolute top-2 right-2 rounded-full bg-white">
                          <span className="text-sm text-black">
                            {index + 1}/
                            {(post.image_urls?.length || 0) +
                              (post.video_url ? 1 : 0)}
                          </span>
                        </div>
                      )}
                    </CarouselItem>
                  ))}
                {post.video_url && (
                  <CarouselItem
                    key={`videoakwdbj-${post.id}`}
                    className="relative w-full"
                  >
                    <video
                      width="100%"
                      controls
                      height="auto"
                      className="h-full w-full object-cover rounded-xl"
                    >
                      <source src={post.video_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </CarouselItem>
                )}
              </CarouselContent>
              <div className="hidden">
                <CarouselPrevious />
                <CarouselNext />
              </div>
            </Carousel>

            {/* Like and Share */}
            <div className="flex justify-between w-full mt-2">
              <button
                className="flex gap-2 mt-1 items-center"
                onClick={() => onLike(post?.id)}
              >
                <FaHeart className="text-red-500" size={20} />
                <span className="text-red-500 text-sm">{post.likes_count}</span>
              </button>
              <button
                className="text-black rounded-2xl text-sm flex items-center justify-center gap-2 bg-black bg-opacity-10 p-2"
                onClick={() => setShareModalOpen(true)}
              >
                <FaLocationArrow />
                Share
              </button>
            </div>
          </div>
        ))}
      </div>
     <ShareModal shareModalOpen={shareModalOpen} setShareModalOpen={setShareModalOpen}/>
    </div>
  );
};

export default FeedPostsList;
// {shareModalOpen && (
//   <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"  onClick={() => setShareModalOpen(false)} >
//     <div className="bg-white p-6 rounded-xl w-96">
//       <div className="flex justify-between items-center  w-full">
//         <h2 className="text-xl tracking-normal font-semibold">
//           Share This Post
//         </h2>

//         <button
//           className="bg-[#F5F5F5] text-black p-2 rounded-full w-9 h-9 flex items-center justify-center hover:bg-gray-200 duration-150"
//           onClick={() => setShareModalOpen(false)} // Close the modal
//         >
//           <RxCross2 size={20} />
//         </button>
//       </div>
//       <div className="grid grid-cols-4 gap-2 my-2">
//         <div className="flex flex-col gap-1 items-center">
//           <Link href={"/feed"}>
//             <div className="w-14 h-14 rounded-full bg-[#E9F6FB] flex items-center justify-center">
//               <FaTwitter size={24} className="text-[#03A9F4]" />
//             </div>
//           </Link>
//           <span className="text-xs text-gray-500 font-normal">
//             Twitter
//           </span>
//         </div>

//         <div className="flex flex-col gap-1 items-center ">
//           <Link href={"/feed"}>
//             <div className="w-14 h-14 rounded-full bg-[#E9F6FB] flex items-center justify-center">
//               <FaFacebook size={24} className="text-[#1877F2]" />
//             </div>
//           </Link>
//           <span className="text-xs text-gray-500 font-normal">
//             Facebook
//           </span>
//         </div>

//         <div className="flex flex-col gap-1 items-center ">
//           <Link href={"/feed"}>
//             <div className="w-14 h-14 rounded-full bg-[#FDECE7] flex items-center justify-center">
//               <FaRedditAlien  size={24} className="text-[#FF5722]" />
//             </div>
//           </Link>
//           <span className="text-xs text-gray-500 font-normal">
//             Reddit
//           </span>
//         </div>

//         <div className="flex flex-col gap-1 items-center ">
//           <Link href={"/feed"}>
//             <div className="w-14 h-14 rounded-full bg-[#ECF5FA] flex items-center justify-center">
//               <FaDiscord  size={24} className="text-[#6665D2]" />
//             </div>
//           </Link>
//           <span className="text-xs text-gray-500 font-normal">
//             Discord
//           </span>
//         </div>
//         <div className="flex flex-col gap-1 items-center ">
//           <Link href={"/feed"}>
//             <div className="w-14 h-14 rounded-full bg-[#E7FBF0] flex items-center justify-center">
//               <IoLogoWhatsapp   size={24} className="text-[#67C15E]" />
//             </div>
//           </Link>
//           <span className="text-xs text-gray-500 font-normal">
//             WhatsApp
//           </span>
//         </div>
//         <div className="flex flex-col gap-1 items-center ">
//           <Link href={"/feed"}>
//             <div className="w-14 h-14 rounded-full bg-[#E5F3FE] flex items-center justify-center">
//               <BiSolidMessageDetail   size={24} className="text-[#1E88E5]" />
//             </div>
//           </Link>
//           <span className="text-xs text-gray-500 font-normal">
//             Messenger
//           </span>
//         </div>
//         <div className="flex flex-col gap-1 items-center">
//           <Link href={"/feed"}>
//             <div className="w-14 h-14 rounded-full bg-[#E6F3FB] flex items-center justify-center">
//               <FaTelegramPlane   size={24} className="text-[#1B92D1]" />
//             </div>
//           </Link>
//           <span className="text-xs text-gray-500 font-normal">
//             Telegram
//           </span>
//         </div>
//         <div className="flex flex-col gap-1 items-center ">
//           <Link href={"/feed"}>
//             <div className="w-14 h-14 rounded-full bg-[#ECF5FA] flex items-center justify-center">
//               <Image src={Instgram}  width={24} height={24} alt="insta" priority />
//             </div>
//           </Link>
//           <span className="text-xs text-gray-500 font-normal">
//             Instagram
//           </span>
//         </div>
        
//       </div>
//       {/* input */}
//       <p className="text-black font-semibold text-base my-2">Page Link</p>
//      <div className="w-full relative flex items-center justify-center">
//       <input type="text" className="w-full text-sm text-[#212121 tracking-wide] outline-none p-3 rounded-md border-none bg-[#D9D9D9] focus:border-blue-500 relative" />
//       <IoIosCopy className="absolute right-2 cursor-pointer text-[#212121]"/>
//      </div>
//     </div>
//   </div>
// )}