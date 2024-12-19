"use client";
import React, { useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/store/user";
import { useRouter, useSearchParams } from "next/navigation";
import NoCover from "@/assets/images/cover image.jpg";
import NoDp from "@/assets/images/nodp.png";
import { useToast } from "@/hooks/use-toast";
import MyPosts from "@/components/MyPosts";


const ProfileContent = () => {
  const { user } = useUser();  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const fromEdit = searchParams.get("fromEdit");
    if (fromEdit === "success") {
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    }
  }, [searchParams, toast]);

  return (
    <div className="w-full">
      <div className="w-full h-40 relative">
        <Image
          src={user?.cover_url! || NoCover}
          alt="cover image"
          sizes="(max-width: 768px) 100vw, 100vw"
          priority={true}
          fill
          style={{
            objectFit: "cover",
          }}
        />
        <Link href={"/feed"} className="absolute m-3 top-0">
          <ArrowLeft className="text-white" size={25} />
        </Link>
        <div className="rounded-full w-[112px] h-[112px] relative left-5 top-24">
          <Image
            src={user?.profile_url! || NoDp}
            priority={true}
            alt="profile"
            sizes="112px"
            fill
            style={{
              objectFit: "cover",
              borderRadius: "100px",
            }}
          />
        </div>
      </div>
      <div className="flex w-full justify-center">
        <Button
          className="w-[55%] ml-28 text-[13px] font-bold my-2 rounded-full tracking-wide"
          variant={"outline"}
          onClick={() => router.push(`/profile/${user?.id}`)}
        >
          Edit Profile
        </Button>
      </div>
      <div className="flex flex-col w-full my-2 px-3 items-start gap-1">
        <h2 className="text-xl m-0 font-semibold capitalize text-black">
          {user?.display_name}
        </h2>
        <p className="text-md text-black">{user?.bio}</p>
      </div>

      <MyPosts id={user?.id!}/>
    </div>
  );
};

// Main component that wraps the content in Suspense
const MainProfile = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
};

export default MainProfile;