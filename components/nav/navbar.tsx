import { useUser } from "@/lib/store/user";
import Image from "next/image";
import React from "react";
import NoDp from "@/assets/images/nodp.png";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { BsTextRight } from "react-icons/bs";
import { LockOpen } from "lucide-react";
import { FaUser } from "react-icons/fa";


const Navbar = () => {
  const { user } = useUser();
  const supabase = createClient();
  const router = useRouter();
  const isReturningUser = user?.created_at
    ? new Date(user.created_at).toDateString() !== new Date().toDateString()
    : false;

     const handleSignout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
          router.push("/login");
        } else {
          toast({title:""})
        }
      };
  return (
    <div className="w-full flex justify-between items-center">
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
      <Popover>
      <PopoverTrigger>
        {" "}
        <div className="bg-[#D9D9D99C] hover:bg-[#B0B0B099] w-12 h-12 flex items-center justify-center rounded-full">
        <BsTextRight
          size={25}
          className="rounded-full"
        />
        </div>
       
      </PopoverTrigger>
      <PopoverContent className="space-y-3 p-2 divide-y">
      <Link href={`/profile/${user?.id}`} className="block">
            <Button
              variant="ghost"
              className="w-full flex justify-between items-center"
            >
              My Profile <FaUser /> 
            </Button>
          </Link>
        <Button
          variant="ghost"
          className="w-full flex justify-between items-center"
          onClick={handleSignout}
        >
          Logout <LockOpen />
        </Button>
      </PopoverContent>
    </Popover>
    </div>
  );
};

export default Navbar;
