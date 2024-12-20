import React from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel'
import { FaHeart } from 'react-icons/fa'
import Image from 'next/image'
import { Post } from '@/lib/types'

const PostList = ({posts}:{posts:Post[]}) => {
  return (
    <div className="flex gap-2">
    {/* First Column */}
    <div className="flex-1 space-y-4">
      {posts &&
        posts.length > 0 &&
        posts
          .filter((_, index) => index % 2 === 0)
          .map((post) => (
            <div key={post.id} className="flex flex-col gap-4">
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
                    <CarouselItem
                      key={post.id}
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
            <div key={post.id} className="flex flex-col gap-4">
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
                    <CarouselItem
                      key={post.id}
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
            </div>
          ))}
    </div>
  </div>
  )
}

export default PostList
