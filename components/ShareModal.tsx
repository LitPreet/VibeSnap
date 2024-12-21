import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaDiscord, FaFacebook, FaRedditAlien, FaTelegramPlane, FaTwitter } from "react-icons/fa";
import { BiSolidMessageDetail } from "react-icons/bi";
import Instgram from "@/assets/images/instagram.png";
import { IoIosCopy, IoLogoWhatsapp } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

const socialLinks = [
  {
    href: "https://twitter.com/intent/tweet?url=",
    icon: <FaTwitter size={24} className="text-[#03A9F4]" />,
    name: "Twitter",
    bgColor: "#E9F6FB",
  },
  {
    href: "https://www.facebook.com/sharer/sharer.php?u=",
    icon: <FaFacebook size={24} className="text-[#1877F2]" />,
    name: "Facebook",
    bgColor: "#E9F6FB",
  },
  {
    href: "https://www.reddit.com/submit?url=",
    icon: <FaRedditAlien size={24} className="text-[#FF5722]" />,
    name: "Reddit",
    bgColor: "#FDECE7",
  },
  {
    href: "https://discord.com/channels/@me",
    icon: <FaDiscord size={24} className="text-[#6665D2]" />,
    name: "Discord",
    bgColor: "#ECF5FA",
  },
  {
    href: "https://wa.me/?text=",
    icon: <IoLogoWhatsapp size={24} className="text-[#67C15E]" />,
    name: "WhatsApp",
    bgColor: "#E7FBF0",
  },
  {
    href: "https://m.me/?text=",
    icon: <BiSolidMessageDetail size={24} className="text-[#1E88E5]" />,
    name: "Messenger",
    bgColor: "#E5F3FE",
  },
  {
    href: "https://t.me/share/url?url=",
    icon: <FaTelegramPlane size={24} className="text-[#1B92D1]" />,
    name: "Telegram",
    bgColor: "#E6F3FB",
  },
  {
    href: "https://www.instagram.com/",
    icon: (
      <Image src={Instgram} width={24} height={24} alt="insta" priority />
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
  const [copied, setCopied] = useState(false);

  if (!shareModalOpen) return null;

  const handleCopy = () => {
    const currentUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/feed"
        : window.location.href;

    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copy status after 2 seconds
    });
  };

  const getCurrentUrl = () => {
    const currentUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/feed"
        : window.location.href;

    return currentUrl ? currentUrl : ""; // Return empty string if URL is undefined
  };

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
          <h2 className="text-xl tracking-normal font-semibold">Share This Post</h2>
          <button
            className="bg-[#F5F5F5] text-black p-2 rounded-full w-9 h-9 flex items-center justify-center hover:bg-gray-200 duration-150"
            onClick={() => setShareModalOpen(false)}
          >
            <RxCross2 size={20} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 my-2">
          {socialLinks.map((link, index) => {
            const currentUrl = getCurrentUrl(); // Get the current URL
            return (
              <div key={index} className="flex flex-col gap-1 items-center">
                <Link href={`${link.href}${encodeURIComponent(currentUrl)}`}>
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center bg-[${link.bgColor}]`}
                  >
                    {link.icon}
                  </div>
                </Link>
                <span className="text-xs text-gray-500 font-normal">{link.name}</span>
              </div>
            );
          })}
        </div>

        <p className="text-black font-semibold text-base my-2">Page Link</p>
        <div className="w-full relative flex items-center justify-center">
          <input
            type="text"
            value={getCurrentUrl()}  // Display the current URL
            className="w-full text-sm text-[#212121] tracking-wide outline-none p-3 rounded-md border-none bg-[#D9D9D9] focus:border-blue-500 relative"
            readOnly
          />
          <IoIosCopy
            className="absolute right-2 cursor-pointer text-[#212121]"
            onClick={handleCopy}
          />
          {copied && (
            <span className="absolute right-10 text-sm text-green-500">Copied!</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
