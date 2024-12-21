import { useUser } from "@/lib/store/user";
import Image from "next/image";
import React from "react";
import NoDp from "@/assets/images/nodp.png";
import Link from "next/link";

const Navbar = () => {
  const { user } = useUser();
  const isReturningUser = user?.created_at
    ? new Date(user.created_at).toDateString() !== new Date().toDateString()
    : false;
  return (
    <div className="w-full ">
      <Link
        href={`/profile/${user?.id}`}
      >
      <div  className="flex items-center gap-2  cursor-pointer  w-fit">
        <div className="relative w-[70px] h-[70px]">
          <Image
            src={user?.profile_url || NoDp}
            alt="userImage"
            sizes="70px"
            priority
            style={{ objectFit: "cover" }}
            fill
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-normal text-gray-400 tracking-wide">
            {" "}
            Welcome {isReturningUser && "Back"}
          </span>
          <span className="text-lg text-black font-semibold tracking-wide capitalize">
            {user?.display_name}
          </span>
        </div>
      </div>
      </Link>
    </div>
  );
};

export default Navbar;
