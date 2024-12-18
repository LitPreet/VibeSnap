'use client'
import React from "react";
import Image from "next/image";
import Image1 from "@/assets/images/image4.jpg";
import Image2 from "@/assets/images/image5.jpg";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/store/user";
import { useRouter } from "next/navigation";

const page = () => {
    const {user} = useUser();
    const router = useRouter()
  return (
    <div className="w-full">
      <div className="w-full h-40 bg-green-300 relative">
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
        <Link href={"/dasboard"} className="absolute m-3 top-0">
          <ArrowLeft className="text-white" size={25} />
        </Link>
        <div className="rounded-full w-[112px] h-[112px]  relative left-5 top-24">
          <Image
            src={Image2}
            priority={true}
            alt="profile"
            sizes="100vw"
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

    </div>
  );
};

export default page;
