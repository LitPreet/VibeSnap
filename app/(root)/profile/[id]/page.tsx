"use client";
import React, { useEffect, Suspense, useTransition, useState } from "react";
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
import { fetchUserData } from "@/lib/actions/user";
import { Iuser } from "@/lib/types";
import ProfileShimmer from "@/components/Shimmers/ProfileShimmer";

const ProfileContent = ({ id }: { id: string }) => {
  const { user } = useUser();
  const [currentuserData, setCurrentUserData] = useState<Iuser | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    const fromEdit = searchParams.get("fromEdit");
    if (fromEdit === "success") {
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    }
  }, [searchParams, toast]);

  useEffect(() => {
    if (!id) return;
    const getUser = async () => {
      try {
        const userData = await fetchUserData(id);
        setCurrentUserData(userData!);
      } catch (err) {
        console.error(err);
      }
    };
    startTransition(() => {
      getUser();
    });
  }, [id]);

  if (isPending)
    return (
      <div>
        <ProfileShimmer />
      </div>
    );

  return (
    <div className="w-full">
      <div className="w-full h-40 relative">
        <Image
          src={currentuserData?.cover_url! || NoCover}
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
        <div className="rounded-full w-[120px] h-[120px] relative left-5 top-24">
          <Image
            src={currentuserData?.profile_url! || NoDp}
            priority={true}
            alt="profile"
            sizes="120px"
            fill
            style={{
              objectFit: "cover",
              borderRadius: "100px",
            }}
          />
        </div>
      </div>
      <div className="flex w-full justify-center">
        {currentuserData?.id === user?.id && (
          <Button
            className="w-[55%] ml-28 text-[13px] font-bold my-2 rounded-full tracking-wide"
            variant={"outline"}
            onClick={() => router.push(`/profile/edit/${user?.id}`)}
          >
            Edit Profile
          </Button>
        )}
      </div>
      <div
        className={`flex flex-col w-full my-2 px-3 items-start gap-1 ${
          currentuserData?.id === user?.id ? "mt-4" : "mt-16"
        }`}
      >
        <h2 className="text-xl m-0 font-semibold capitalize text-black">
          {currentuserData?.display_name}
        </h2>
        <p className="text-md text-black">{currentuserData?.bio}</p>
      </div>

      <MyPosts id={currentuserData?.id!} />
    </div>
  );
};

const MainProfile = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileContent id={id} />
    </Suspense>
  );
};

export default MainProfile;
