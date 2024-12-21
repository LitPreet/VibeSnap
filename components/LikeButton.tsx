import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  postId: string;
  likes_count: number;
  is_liked: boolean | undefined;
  onLike: (postId: string) => void;
}

const LikeButton = ({ postId, likes_count, is_liked, onLike }: LikeButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    onLike(postId);
    // Reset animation after it completes
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      className="flex gap-2 mt-1 items-center group transition-all duration-200"
      onClick={handleClick}
    >
      {is_liked ? (
        <FaHeart
          className={cn(
            "text-red-500 transition-all duration-200",
            isAnimating && "scale-125",
            "group-hover:scale-110"
          )}
          size={20}
        />
      ) : (
        <FaRegHeart
          className="text-gray-500 hover:text-red-500 transition-all duration-200 group-hover:scale-110"
          size={20}
        />
      )}
      <span
        className={cn(
          "text-sm transition-all duration-200",
          is_liked ? "text-red-500" : "text-gray-500"
        )}
      >
        {likes_count}
      </span>
    </button>
  );
};

export default LikeButton;