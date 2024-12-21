import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaDiscord, FaFacebook, FaHeart, FaLocationArrow, FaRedditAlien, FaTelegramPlane, FaTwitter } from "react-icons/fa";
import { BiSolidMessageDetail } from "react-icons/bi";
import Instgram from "@/assets/images/instagram.png"
import { FaSquareInstagram } from "react-icons/fa6";
import { IoIosCopy, IoLogoWhatsapp } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

const socialLinks = [
  {
    href: "/feed",
    icon: <FaTwitter size={24} className="text-[#03A9F4]" />,
    name: "Twitter",
    bgColor: "#E9F6FB",
  },
  {
    href: "/feed",
    icon: <FaFacebook size={24} className="text-[#1877F2]" />,
    name: "Facebook",
    bgColor: "#E9F6FB",
  },
  {
    href: "/feed",
    icon: <FaRedditAlien size={24} className="text-[#FF5722]" />,
    name: "Reddit",
    bgColor: "#FDECE7",
  },
  {
    href: "/feed",
    icon: <FaDiscord size={24} className="text-[#6665D2]" />,
    name: "Discord",
    bgColor: "#ECF5FA",
  },
  {
    href: "/feed",
    icon: <IoLogoWhatsapp size={24} className="text-[#67C15E]" />,
    name: "WhatsApp",
    bgColor: "#E7FBF0",
  },
  {
    href: "/feed",
    icon: <BiSolidMessageDetail size={24} className="text-[#1E88E5]" />,
    name: "Messenger",
    bgColor: "#E5F3FE",
  },
  {
    href: "/feed",
    icon: <FaTelegramPlane size={24} className="text-[#1B92D1]" />,
    name: "Telegram",
    bgColor: "#E6F3FB",
  },
  {
    href: "/feed",
    icon: (
        <Image src={Instgram}  width={24} height={24} alt="insta" priority />
    ),
    name: "Instagram",
    bgColor: "#ECF5FA",
  },
];

const ShareModal = ({
  shareModalOpen,
  setShareModalOpen,
}: {
  shareModalOpen: boolean;
  setShareModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  if (!shareModalOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => setShareModalOpen(false)}
    >
      <div
        className="bg-white p-6 rounded-xl w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl tracking-normal font-semibold">
            Share This Post
          </h2>
          <button
            className="bg-[#F5F5F5] text-black p-2 rounded-full w-9 h-9 flex items-center justify-center hover:bg-gray-200 duration-150"
            onClick={() => setShareModalOpen(false)}
          >
            <RxCross2 size={20} />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2 my-2">
          {socialLinks.map((link, index) => (
            <div key={index} className="flex flex-col gap-1 items-center">
              <Link href={link.href}>
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center bg-[${link.bgColor}]`}
                >
                  {link.icon}
                </div>
              </Link>
              <span className="text-xs text-gray-500 font-normal">
                {link.name}
              </span>
            </div>
          ))}
        </div>

        <p className="text-black font-semibold text-base my-2">Page Link</p>
        <div className="w-full relative flex items-center justify-center">
          <input
            type="text"
            className="w-full text-sm text-[#212121 tracking-wide] outline-none p-3 rounded-md border-none bg-[#D9D9D9] focus:border-blue-500 relative"
          />
          <IoIosCopy className="absolute right-2 cursor-pointer text-[#212121]" />
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
