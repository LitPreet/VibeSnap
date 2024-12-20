import { createClient } from "../supabase/client";
import { Iuser } from "../types";
export const fetchUserData = async (userId: string) => {
    const supabase = await createClient();
  
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single(); 
      if (error) throw new Error(error.message);
      if (!data) throw new Error("No user found with the given ID.");
      return data as Iuser;
    } catch (error) {
      console.error("Error fetching userData:", error);
      return null; 
    }
  };
  