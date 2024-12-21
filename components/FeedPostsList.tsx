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
import { formatPostDate, lightColors } from "@/lib/helpers-utils";
import { useRouter } from "next/navigation";
import ShareModal from "./ShareModal";
import {  FaLocationArrow } from "react-icons/fa";
import LikeButton from "./LikeButton";
import { Plus } from "lucide-react";
import FeedSkeleton from "./Shimmers/FeedShimmer";

const FeedPostsList = ({
  posts,
  onLike,
}: {
  posts: Post[];
  onLike: (postId: string) => void;
}) => {
  const router = useRouter();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (posts) {
      setIsLoading(false);
    }
  }, [posts]);

  useEffect(() => {
    if (shareModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto"; 
    }

    return () => {
      document.body.style.overflow = "auto"; 
    };
  }, [shareModalOpen]);

  return (
    <div className="w-full  bg-red-40">
      <h2 className="text-2xl font-bold mt-5">Feeds</h2>
      <div className="w-full mt-4">
        {isLoading ? (<FeedSkeleton />) :(posts.map((post, i: number) => {
         return ( <div key={i}  className={`rounded-2xl h-auto p-4  ${lightColors[i % lightColors.length]} mb-4`}>
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
              <LikeButton
              postId={post.id}
              likes_count={post.likes_count}
              is_liked={post?.is_liked}
              onLike={onLike}
            />
              <button
                className="text-black rounded-2xl text-sm flex items-center justify-center gap-2 bg-black bg-opacity-10 p-2"
                onClick={() => setShareModalOpen(true)}
              >
                <FaLocationArrow />
                Share
              </button>
            </div>
          </div>
        )}
        ))}
      
      </div>
     <ShareModal shareModalOpen={shareModalOpen} setShareModalOpen={setShareModalOpen}/>
     <button
        className="mt-6 w-[50px] bg-black flex justify-center items-center h-[50px] rounded-full fixed bottom-9 right-9 hover:bg-gray-800"
        onClick={() => router.push("/create-post")}
      >
        <Plus size={27} className="text-white font-bold" />
      </button>
    </div>
  );
};

export default FeedPostsList;
