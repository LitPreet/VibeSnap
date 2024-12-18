"use client";
import { Iuser } from "@/lib/types";
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Image1 from "@/assets/images/image4.jpg";
import Image2 from "@/assets/images/image5.jpg";
import Link from "next/link";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/lib/supabase/client";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import imageCompression from "browser-image-compression";
import {
  compressImage,
  createFilePreview,
  generateSupabaseFilePath,
} from "@/lib/image-utils";
import {
  updateUserProfile,
  uploadToSupabase,
} from "@/lib/supabase-storage-utils";
import { editProfileformSchema as formSchema } from "@/lib/schemas";

const EditProfile = ({ user }: { user: Iuser }) => {
  const [profilePreview, setProfilePreview] = useState(user?.profile_url || "");
  const [coverPreview, setCoverPreview] = useState(user?.cover_url || "");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const supabase = createClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      display_name: user?.display_name || "",
      bio: user?.bio || "",
    },
  });

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (url: string) => void,
    setFile: (file: File | null) => void,
    isProfileImage: boolean
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Compress and set preview
      const compressedFile = await compressImage(file, isProfileImage);
      if (compressedFile) {
        setPreview(createFilePreview(compressedFile));
        setFile(compressedFile);
      }
    }
  };

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let profileUrl = user?.profile_url;
      let coverUrl = user?.cover_url;

      // Upload profile image if new file exists
      if (profileFile) {
        const profilePath = generateSupabaseFilePath(user?.id!, "profile");
        profileUrl =
          (await uploadToSupabase(supabase, profileFile, profilePath)) ||
          profileUrl;
      }

      // Upload cover image if new file exists
      if (coverFile) {
        const coverPath = generateSupabaseFilePath(user?.id!, "cover");
        coverUrl =
          (await uploadToSupabase(supabase, coverFile, coverPath)) || coverUrl;
      }

      // Update user profile
      const updateSuccess = await updateUserProfile(supabase, {
        id: user?.id!,
        display_name: values.display_name,
        bio: values.bio,
        profile_url: profileUrl!,
        cover_url: coverUrl!,
        email: user?.email!,
      });

      if (updateSuccess) {
        alert("Profile updated successfully!");
        setProfileFile(null)
        setCoverFile(null)
      } else {
        alert("Error updating profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Unexpected error occurred");
    }
  };
  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            name="display_name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter display name" />
                </FormControl>
                {form.formState.errors.display_name && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.display_name.message}
                  </p>
                )}
              </FormItem>
            )}
          />

          <FormField
            name="bio"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter bio" />
                </FormControl>
                {form.formState.errors.bio && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.bio.message}
                  </p>
                )}
              </FormItem>
            )}
          />
          <div>
            <label htmlFor="profileImage" className="block text-sm font-medium">
              Profile Image
            </label>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={(e) =>
                handleImageChange(e, setProfilePreview, setProfileFile, true)
              }
            />
            {profilePreview && (
              <img
                src={profilePreview}
                alt="Profile Preview"
                className="mt-2 w-32 h-32 rounded-full object-cover"
              />
            )}
          </div>

          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium">
              Cover Image
            </label>
            <input
              type="file"
              id="coverImage"
              accept="image/*"
              onChange={(e) =>
                handleImageChange(e, setCoverPreview, setCoverFile, false)
              }
            />
            {coverPreview && (
              <img
                src={coverPreview}
                alt="Cover Preview"
                className="mt-2 w-full h-40 object-cover"
              />
            )}
          </div>
        
          <Button type="submit">Update Profile</Button>
        </form>
      </Form>
    </div>
  );
};

export default EditProfile;
{
  /* <div className="w-full h-40 bg-green-300 relative">
            <Image
              src={Image1}
              alt="cover image"
              sizes="100vw"
              priority={true}
              fill
              style={{
                objectFit: "cover",
              }}
            />
            <Link
              href="/profile"
              className="absolute top-0 m-3 flex items-center gap-2"
            >
              <ArrowLeft className="text-white" size={25} />
              <span className="text-white text-md font-bold tracking-wide">
                Edit Profile
              </span>
            </Link>
            <div className="rounded-full w-[112px] h-[112px]  relative left-5 top-24">
              <Image
                src={Image2}
                priority={true}
                alt="cover image"
                sizes="100vw"
                fill
                style={{
                  objectFit: "cover",
                  borderRadius: "100px",
                }}
              />
            </div>
          </div> */
}
