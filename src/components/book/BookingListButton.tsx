import { useState } from "react";

interface BookingListButtonProps {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export default function BookingListButton({
  onClick,
  className = "",
  children = "BOOK NOW",
}: BookingListButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative cursor-pointer flex items-center justify-center px-8 md:px-12 py-3 md:py-4 text-[14px] md:text-[20px] rounded-md transition-all duration-300 font-inter font-bold ${className}`}
      style={{
        backgroundColor: isHovered ? "transparent" : "#1A1A1A",
        backgroundImage: isHovered
          ? "linear-gradient(to left, #33FF00, #187700)"
          : "none",
        border: isHovered ? "none" : "0.5px solid #1CFF21",
        color: isHovered ? "#19181E" : "#1CFF21",
        fontWeight: 700,
        lineHeight: 1,
        boxShadow: isHovered
          ? "0 4px 30px rgba(51, 255, 0, 0.4), 0 5px 0 rgba(7, 59, 0, 1)"
          : "0 0 12px rgba(28, 255, 33, 0.5)",
      }}
    >
      {children}
    </button>
  );
}
