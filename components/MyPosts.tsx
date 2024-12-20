import { fetchPosts } from "@/lib/actions/post";
import { Post } from "@/lib/types";
import React, { useCallback, useEffect, useState, useTransition } from "react";
import { Button } from "./ui/button";
import NoData from "@/assets/images/no-data.png";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import PostList from "./PostList";
import { useUser } from "@/lib/store/user";

const MyPosts = ({ id }: { id: string | undefined }) => {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();

  
 const getPosts = useCallback(async () => {
  if (!id) return;
  try {
    const postsData = await fetchPosts(id);
    setPosts(prevPosts => {
      if (JSON.stringify(prevPosts) !== JSON.stringify(postsData)) {
        return postsData;
      }
      return prevPosts;
    });
  } catch (err) {
    console.error(err);
  }
}, [id]);

  useEffect(() => {
    getPosts();
  }, [id, getPosts]);

  if (!id) return;
  return (
    <div className="w-full px-3 mt-4 relative">
      <h2 className="text-black text-lg  font-semibold">
        {user?.id === id ? "My Posts" : `Posts`}
      </h2>
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
            {user?.id === id
              ? "You haven’t created any posts yet."
              : "This account does not have any posts yet."}
          </p>
          {user?.id === id && (<Button
            className="mt-6 rounded-full"
            onClick={() => router.push("/create-post")}
          >
            Create Post
            <Plus size={27} className="text-white font-bold" />
          </Button>)}
         
        </div>
      ) : (
        <div className="w-full my-3">
          <PostList posts={posts} />
        </div>
      )}
      {user?.id === id &&  (<button
        className="mt-6 w-[50px] bg-black flex justify-center items-center h-[50px] rounded-full fixed bottom-9 right-9 hover:bg-gray-800"
        onClick={() => router.push("/create-post")}
      >
        <Plus size={27} className="text-white font-bold" />
      </button>)}
     
    </div>
  );
};

export default MyPosts;
