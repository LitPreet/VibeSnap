import { fetchPosts } from "@/lib/actions/post";
import { Post } from "@/lib/types";
import React, { useCallback, useEffect, useState, useTransition } from "react";
import NoData from "@/assets/images/no-data.png";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import PostList from "./PostList";
import { useUser } from "@/lib/store/user";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/hooks/use-toast";
import MyPostShimmer from "./Shimmers/MyPostShimmer";

const MyPosts = ({ id }: { id: string | undefined }) => {
  const { user } = useUser();
  const supabase = createClient();
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();
  const [isPending,startTransition] = useTransition();

  const getPosts = useCallback(async () => {
    if (!id) return;
    try {
      startTransition(async() => {
        const postsData = await fetchPosts(id);
      setPosts((prevPosts) => {
        if (JSON.stringify(prevPosts) !== JSON.stringify(postsData)) {
          return postsData;
        }
        return prevPosts;
      });
      })
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  const handleDeletePost = useCallback(
    async (post_id: string, user_id: string) => {
      try {
        const { data, error: fetchError } = await supabase
          .from("posts")
          .select("user_id")
          .eq("id", post_id)
          .single();

        if (fetchError) {
          console.error("Error fetching post:", fetchError);
          return;
        }

        if (data?.user_id === user_id) {
          // Delete the post if the user is the owner
          const { error: deleteError } = await supabase
            .from("posts")
            .delete()
            .eq("id", post_id);

          if (deleteError) {
            toast({ title: "Error deleting post", variant: "destructive" });
          } else {
            toast({ title: "Post deleted successfully!", variant: "default" });
            setPosts((prevPosts) =>
              prevPosts.filter((post) => post.id !== post_id)
            );
          }
        } else {
          toast({ title: "Something went wrong!", variant: "destructive" });
        }
      } catch (error) {
        console.error("Error in handleDeletePost:", error);
      }
    },
    []
  );

  useEffect(() => {
    getPosts();
  }, [id, getPosts]);

  if (!id) return;

  if(isPending) return <MyPostShimmer />
  return (
    <div className="w-full px-3 mt-4 relative">
      <h2 className="text-black text-lg  font-semibold">
        {user?.id === id ? "My Posts" : `Posts`}
      </h2>
      {posts.length === 0 ? (
        <div className="w-full h-52 my-2 flex-col flex justify-end items-center">
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
        </div>
      ) : (
        <div className="w-full my-3">
          <PostList posts={posts} handleDeletePost={handleDeletePost} />
        </div>
      )}
      {user?.id === id && (
        <button
          className="mt-6 w-[50px] bg-black flex justify-center items-center h-[50px] rounded-full fixed bottom-9 right-9 hover:bg-gray-800"
          onClick={() => router.push("/create-post")}
        >
          <Plus size={27} className="text-white font-bold" />
        </button>
      )}
    </div>
  );
};

export default MyPosts;
