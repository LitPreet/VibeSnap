"use client";
import { Button } from "@/components/ui/button";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/nav/navbar";
import FeedPostsList from "@/components/FeedPostsList";
import { Post } from "@/lib/types";
import { throttle } from "@/lib/helpers-utils";
import { useUser } from "@/lib/store/user";

const Feed = () => {
  const router = useRouter();
  const supabase = createClient();
  const {user} = useUser();

  const loadingRef = useRef(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);

  const handleSignout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push("/login");
    } else {
      console.error("Error signing out:", error.message);
    }
  };

  const fetchPosts = useCallback(async (pageNum: number) => {
    if (loadingRef.current) return;
    
    loadingRef.current = true;
    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        users (
          display_name
        )
      `)
      .range((pageNum - 1) * 10, pageNum * 10 - 1)
      .order('created_at', { ascending: false }); 

    if (error) {
      console.error(error);
    } else {
      const transformedData: Post[] = data.map(post => ({
        ...post,
        userName: {
          display_name: post.users?.display_name || "Unknown User"
        }
      }));

      setPosts(prevPosts => {
        if (pageNum === 1) return transformedData;
        const existingIds = new Set(prevPosts.map(post => post.id));
        return [...prevPosts, ...transformedData.filter(post => !existingIds.has(post.id))];
      });
    }
    loadingRef.current = false;
  }, []); 

  
  const handleScroll = useCallback(
    throttle(() => {
      if (loadingRef.current) return;

      const scrollPosition = window.innerHeight + window.scrollY;
      const scrollThreshold = document.documentElement.scrollHeight - 200;

      if (scrollPosition >= scrollThreshold) {
        setPage(prev => prev + 1);
      }
    }, 200),
    []
  );

 
  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  
  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page, fetchPosts]);

 
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);


  const handleLike = useCallback(
    async (postId: string) => {
      console.log(postId, 'hey')
      try {
        const { data, error } = await supabase.rpc("toggle_like_uuid", { current_post_id: postId});
        if (error) {
          console.error("Error toggling like:", error.message);
        } else {
          // After toggling the like, fetch the updated post data (including likes_count)
          const { data: updatedPost, error: fetchError } = await supabase
            .from("posts")
            .select("id, likes_count")
            .eq("id", postId)
            .single();
        
          if (fetchError) {
            console.error("Error fetching updated post:", fetchError.message);
          } else {
            // Update the posts state with the updated likes_count
            setPosts((prevPosts) =>
              prevPosts.map((post) =>
                post.id === postId ? { ...post, likes_count: updatedPost.likes_count } : post
              )
            );
          }
        }
      } catch (err) {
        console.error("Error in handleLike:", err);
      }
    },
    [supabase]
  );
// console.log(supabase.auth.user()?.id)
  return (
    <div className="p-3 min-h-screen overflow-y-scroll overflow-x-hidden w-full">
      <Navbar />
      <FeedPostsList posts={posts} onLike={handleLike}/>
      <Button onClick={handleSignout}>SIGN OUT</Button>
    </div>
  );
};

export default Feed;