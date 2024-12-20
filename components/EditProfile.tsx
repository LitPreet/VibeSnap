"use client";
import { Iuser } from "@/lib/types";
import React, { useRef, useState, useTransition } from "react";
import { ArrowLeft, Loader2, Pencil } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "./ui/button";
import Image from "next/image";
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
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/store/user";
import NoCover from "@/assets/images/cover image.jpg";
import NoDp from "@/assets/images/nodp.png";

const EditProfile = ({ userData }: { userData: Iuser }) => {
  const [profilePreview, setProfilePreview] = useState(
    userData?.profile_url || NoDp
  );
  const [coverPreview, setCoverPreview] = useState(userData?.cover_url || NoCover);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const profileImageRef = useRef<HTMLInputElement>(null);
  const coverImageRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const {  setUser } = useUser();
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const supabase = createClient();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      display_name: userData?.display_name || "",
      bio: userData?.bio || "",
    },
  });

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (url: string) => void,
    setFile: (file: File | null) => void,
    isProfileImage: boolean
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedFile = await compressImage(file, isProfileImage);
      if (compressedFile) {
        setPreview(createFilePreview(compressedFile));
        setFile(compressedFile);
      }
    } catch (err:unknown) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process image. Please try again.",
      });
    }
  };

  const handleEditClick = (type: "profile" | "cover") => {
    const ref = type === "profile" ? profileImageRef : coverImageRef;
    ref.current?.click();
  };
  const hasFormChanged = (values: z.infer<typeof formSchema>) => {
    return (
      values.display_name !== userData?.display_name ||
      values.bio !== userData?.bio ||
      profileFile !== null ||
      coverFile !== null
    );
  };

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!hasFormChanged(values)) {
      toast({
        variant: "destructive",
        title: "No Changes",
        description: "No changes to save.",
      });
      return;
    }

    startTransition(async () => {
      try {
        let profileUrl = userData?.profile_url;
        let coverUrl = userData?.cover_url;

        // Only upload new images if files have been selected
        if (profileFile) {
          const profilePath = generateSupabaseFilePath(
            userData?.id!,
            "profile"
          );
          const newProfileUrl = await uploadToSupabase(
            supabase,
            profileFile,
            profilePath
          );
          if (newProfileUrl) profileUrl = newProfileUrl;
        }

        if (coverFile) {
          const coverPath = generateSupabaseFilePath(userData?.id!, "cover");
          const newCoverUrl = await uploadToSupabase(
            supabase,
            coverFile,
            coverPath
          );
          if (newCoverUrl) coverUrl = newCoverUrl;
        }

        // Update user profile
        const updateSuccess = await updateUserProfile(supabase, {
          id: userData?.id!,
          display_name: values.display_name,
          bio: values.bio,
          profile_url: profileUrl!,
          cover_url: coverUrl!,
          email: userData?.email!,
        });

        if (updateSuccess) {
          // Reset file states after successful update
          setUser({
            display_name: values.display_name,
            created_at: userData?.created_at || "",
            email: userData?.email || "",
            id: userData?.id || "",
            bio: values.bio || null,
            profile_url: profileUrl!,
            cover_url: coverUrl || null,
          });
          setProfileFile(null);
          setCoverFile(null);
          router.push(`/profile/${userData?.id}?fromEdit=success`);
        } else {
          throw new Error("Failed to update profile");
        }
      } catch (error) {
        console.log(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update profile. Please try again.",
        });
      }
    });
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <div className="w-full h-40  relative">
            <Image
              src={coverPreview}
              alt="cover image"
              sizes="(max-width: 768px) 100vw, 100vw"
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
            <div className="rounded-full  w-[120px] h-[120px]  relative left-5 top-24">
              <Image
                src={profilePreview}
                priority={true}
                alt="cover image"
                sizes="120px"
                fill
                style={{
                  objectFit: "cover",
                  borderRadius: "100px",
                }}
              />
              <button
                type="button"
                className="w-8 h-8 right-3 hover:bg-gray-300 duration-150 bottom-5 absolute rounded-full bg-gray-200 flex items-center justify-center"
                onClick={() => handleEditClick("profile")}
              >
                <Pencil size={13} />
              </button>
            </div>
            <button
              type="button"
              className="w-8 h-8 right-5 hover:bg-gray-300 duration-150 absolute rounded-full bg-gray-200 flex items-center justify-center"
              onClick={() => handleEditClick("cover")}
            >
              <Pencil size={13} />
            </button>
          </div>

          <div className="top-16 relative px-3 space-y-3 w-full h-[70vh]">
            <FormField
              name="display_name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="m-0">
                  <FormLabel className="text-lg m-0 font-normal text-gray-500">
                    Name
                  </FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      placeholder="Enter name"
                      className="py-1  pe-0  text-md font-semibold ps-1 block w-full bg-transparent border-t-transparent border-b-2 border-x-transparent border-b-gray-200  focus:border-t-transparent focus:border-x-transparent focus:border-b-blue-500 focus:ring-0 disabled:opacity-50 disabled:pointer-events-none dark:border-b-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 dark:focus:border-b-neutral-600 outline-none"
                    />
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
                <FormItem className="m-0">
                  <FormLabel className="text-lg m-0 font-normal text-gray-500">
                    Bio
                  </FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      placeholder="Enter bio"
                      className="py-1  pe-0  text-md font-semibold ps-1 block w-full bg-transparent border-t-transparent border-b-2 border-x-transparent border-b-gray-200  focus:border-t-transparent focus:border-x-transparent focus:border-b-blue-500 focus:ring-0 disabled:opacity-50 disabled:pointer-events-none dark:border-b-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 dark:focus:border-b-neutral-600 outline-none"
                    />
                  </FormControl>
                  {form.formState.errors.bio && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.bio.message}
                    </p>
                  )}
                </FormItem>
              )}
            />
          </div>
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            className="hidden"
            ref={profileImageRef}
            onChange={(e) =>
              handleImageChange(e, setProfilePreview, setProfileFile, true)
            }
          />
          <input
            type="file"
            id="coverImage"
            accept="image/*"
            className="hidden"
            ref={coverImageRef}
            onChange={(e) =>
              handleImageChange(e, setCoverPreview, setCoverFile, false)
            }
          />

          <div className="w-full flex justify-center ">
            <Button
              type="submit"
              disabled={isPending}
              className="w-[90%] z-10 text-md rounded-full cursor-pointer bottom-3"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditProfile;
