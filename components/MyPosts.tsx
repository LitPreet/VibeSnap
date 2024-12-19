import { fetchPosts } from "@/lib/actions/post";
import { Post } from "@/lib/types";
import React, { useEffect, useState, useTransition } from "react";
import { Button } from "./ui/button";
import NoData from "@/assets/images/no-data.png";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const MyPosts = ({ id }: { id: string | undefined }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter()
  
  useEffect(() => {
    if (!id) return;
    const getPosts = async () => {
      try {
        const postsData = await fetchPosts(id);
        setPosts(postsData);
      } catch (err) {console.log(err)}
    };
    startTransition(() => {
      getPosts();
    });
  }, [id]);
  
  if (!id) return;
  if(isPending) return <p>fetching</p>
  return (
    <div className="w-full px-3 mt-4">
      <h2 className="text-black text-lg  font-semibold">My Posts</h2>
      {posts.length === 0 ? (
        <div className="w-full h-52 my-2 flex-col flex justify-center items-center">
          <Image
            src={NoData}
            alt="no data"
            priority={false}
            width={40}
            height={40}
          />
          <p className="text-sm text-black font-normal my-2">
            {" "}
            You haven’t created any posts yet.
          </p>
          <Button className="mt-6 rounded-full" onClick={()=> router.push('/create-post')}>
            Create Post<Plus size={27} className="text-white font-bold" />
          </Button>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {posts &&
            posts.length > 0 &&
            posts.map((post: Post) => (
              <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold">{post.text}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(post.timestamp).toLocaleString()}
                </p>
                <div className="mt-2">
                  {/* Display images if available */}
                  {post.image_urls && post.image_urls.length > 0 && (
                    <div className="flex gap-2">
                      {post.image_urls.map((url: string, index: number) => (
                        <Image
                          key={index}
                          src={url}
                          alt={`Post image ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-md"
                          priority={false}
                          width={40}
                          height={40}
                        />
                      ))}
                    </div>
                  )}
                  {/* Display video if available */}
                  {post.video_url && (
                    <div className="mt-2">
                      <video width="100%" controls>
                        <source src={post.video_url} type="video/mp4" />
                      </video>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
