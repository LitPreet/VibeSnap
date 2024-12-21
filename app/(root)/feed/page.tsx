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
  const { user } = useUser();
  const loadingRef = useRef(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const lastFetchedPageRef = useRef(1);

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
  
    const userId = user?.id;
    if (!userId) {
      loadingRef.current = false;
      return;
    }
  
    // Fetch Posts
    const startRange = (pageNum - 1) * 10;
    const endRange = pageNum * 10 - 1;
  
    const { data: postsData, error: postsError } = await supabase
      .from("posts")
      .select(`
        *,
        users!posts_user_id_fkey (
          display_name
        )
      `)
      .range(startRange, endRange)
      .order("created_at", { ascending: false });
  
    // Fetch Likes
    const { data: likedPostIds, error: likesError } = await supabase
      .from("likes")
      .select("post_id")
      .eq("user_id", userId);
  
    if (postsError || likesError) {
      console.error("Error fetching data:", postsError || likesError);
      loadingRef.current = false;
      return;
    }
  
    // Transform and Set Posts
    const likedIdsSet = new Set(likedPostIds.map((like) => like.post_id));
    const transformedData = postsData.map((post) => ({
      ...post,
      userName: {
        display_name: post.users?.display_name || "Unknown User"
      },
      is_liked: likedIdsSet.has(post.id),
    }));
  
    setPosts((prevPosts) => {
      if (pageNum === 1) return transformedData;
      const existingIds = new Set(prevPosts.map((post) => post.id));
      return [...prevPosts, ...transformedData.filter((post) => !existingIds.has(post.id))];
    });
  
    loadingRef.current = false;
  }, [user?.id]);
  
  
  // Handle like function update
  const handleLike = useCallback(
    async (postId: string) => {
      try {
        // Optimistically update UI
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === postId
              ? {
                  ...post,
                  likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1,
                  is_liked: !post.is_liked
                }
              : post
          )
        );
  
        const { error } = await supabase.rpc("toggle_like_uuid", { 
          current_post_id: postId 
        });
        
        if (error) {
          console.error("Error toggling like:", error.message);
         
          setPosts(prevPosts =>
            prevPosts.map(post =>
              post.id === postId
                ? {
                    ...post,
                    likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1,
                    is_liked: !post.is_liked
                  }
                : post
            )
          );
        }
      } catch (err) {
        console.error("Error in handleLike:", err);
      }
    },
    [supabase]
  );

  
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
    if (page > lastFetchedPageRef.current) {
      lastFetchedPageRef.current = page;
      fetchPosts(page);
    }
  }, [page, fetchPosts]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  
  return (
    <div className="p-3 min-h-screen overflow-y-scroll overflow-x-hidden w-full">
      <Navbar />
      <FeedPostsList posts={posts} onLike={handleLike} />
      <Button onClick={handleSignout}>SIGN OUT</Button>
    </div>
  );
};

export default Feed;