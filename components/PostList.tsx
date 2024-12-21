import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { FaHeart, FaTrash } from "react-icons/fa";
import Image from "next/image";
import { Post } from "@/lib/types";
import { useUser } from "@/lib/store/user";

const PostList = ({
  posts,
  handleDeletePost,
}: {
  posts: Post[];
  handleDeletePost: (post_id: string, user_id: string) => Promise<void>;
}) => {
  const { user } = useUser();

  return (
    <div className="flex gap-2">
      <div className="flex-1 space-y-4">
        {posts &&
          posts.length > 0 &&
          posts
            .filter((_, index) => index % 2 === 0)
            .map((post) => (
              <div key={post.id} className="flex flex-col gap-4 ">
                <Carousel className="w-full max-w-xs">
                  <CarouselContent>
                    {post.image_urls &&
                      post.image_urls.length > 0 &&
                      post.image_urls.map((imageUrl, index) => (
                        <CarouselItem
                          key={index}
                          className="relative w-full h-auto"
                        >
                          <Image
                            src={imageUrl}
                            alt={`Post image ${index}`}
                            className="aspect-auto w-full rounded-xl"
                            width={0}
                            height={100}
                            style={{
                              objectFit: "cover",
                            }}
                            sizes="100vw"
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
                          <div className="absolute bottom-4 left-8">
                            <p className="text-white font-semibold text-[16px]">
                              {post.text
                                ? post.text.length > 18
                                  ? `${post.text.slice(0, 18)}...`
                                  : post.text
                                : ""}
                            </p>
                            <div className="flex gap-1 mt-1 items-center">
                              <FaHeart className="text-white" />
                              <span className="text-white text-xm">
                                {post.likes_count && post.likes_count}
                              </span>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    {post.video_url && (
                      <CarouselItem key={post.id} className="relative w-full">
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
                  {user?.id === post.user_id && (
                    <button
                      onClick={() => handleDeletePost(post.id, user.id)}
                      className="absolute left-2 top-2  p-2 rounded-full bg-red-600  text-white hover:bg-red-700 transition duration-200"
                    >
                      <FaTrash size={20} />
                    </button>
                  )}
                </Carousel>
              </div>
            ))}
      </div>

      {/* Second Column */}
      <div className="flex-1 space-y-4">
        {posts &&
          posts.length > 0 &&
          posts
            .filter((_, index) => index % 2 !== 0)
            .map((post) => (
              <div key={post.id} className="flex flex-col gap-4 relative">
                <Carousel className="w-full max-w-xs">
                  <CarouselContent>
                    {post.image_urls &&
                      post.image_urls.length > 0 &&
                      post.image_urls.map((imageUrl, index) => (
                        <CarouselItem
                          key={index}
                          className="relative w-full h-auto"
                        >
                          <Image
                            src={imageUrl}
                            alt={`Post image ${index}`}
                            className="aspect-auto w-full rounded-xl"
                            width={600} // Set a fixed width or calculate dynamically if needed
                            height={400} // Set an appropriate height
                            style={{
                              objectFit: "cover",
                            }}
                            sizes="(max-width: 768px) 100vw, 50vw" // Define responsive image sizes
                            priority={index === 0} // Load first image with priority (LCP)
                            // width={0}
                            // height={100}
                            // style={{
                            //   objectFit: "cover",
                            // }}
                            // sizes="100vw"
                            // priority={false}
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
                          <div className="absolute bottom-4 left-8">
                            <p className="text-white font-semibold text-[16px]">
                              {post.text
                                ? post.text.length > 18
                                  ? `${post.text.slice(0, 18)}...`
                                  : post.text
                                : ""}
                            </p>
                            <div className="flex gap-1 mt-1 items-center">
                              <FaHeart className="text-white" />
                              <span className="text-white text-xm">
                                {post.likes_count && post.likes_count}
                              </span>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    {post.video_url && (
                      <CarouselItem key={post.id} className="relative w-full">
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
                  {user?.id === post.user_id && (
                    <button
                      onClick={() => handleDeletePost(post.id, user.id)}
                      className="absolute left-2 top-2  p-2 rounded-full bg-red-600  text-white hover:bg-red-700 transition duration-200"
                    >
                      <FaTrash size={20} />
                    </button>
                  )}
                </Carousel>
              </div>
            ))}
      </div>
    </div>
  );
};

export default PostList;
