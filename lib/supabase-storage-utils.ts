import { SupabaseClient } from '@supabase/supabase-js';

export async function uploadToSupabase(
  supabase: SupabaseClient, 
  file: File, 
  path: string
): Promise<string | null> {
  try {
    // Upload the file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("user-uploads")
      .upload(path, file, { 
        cacheControl: '3600', 
        upsert: true 
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("user-uploads")
      .getPublicUrl(path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('File upload error:', error);
    return null;
  }
}

export async function updateUserProfile(
  supabase: SupabaseClient, 
  userData: {
    id: string;
    display_name: string;
    bio: string;
    profile_url?: string;
    cover_url?: string;
    email: string;
  }
): Promise<boolean> {
  try {
    const { error } = await supabase.from("users").upsert(userData);

    if (error) {
      console.error('Profile update error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error updating profile:', error);
    return false;
  }
}