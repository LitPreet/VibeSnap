
import { createClient } from "../supabase/client";
import { Post } from "../types";


export const fetchPosts = async (userId: string) => {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", userId)
      .order("timestamp", { ascending: false });

    if (error) throw new Error(error.message);

    return data as Post[];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};
