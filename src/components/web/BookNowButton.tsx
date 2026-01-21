import { useState } from "react";

interface BookNowButtonProps {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
}

export default function BookNowButton({
  onClick,
  className = "",
  children = "BOOK NOW",
  type = "button",
}: BookNowButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative cursor-pointer px-8 md:px-12 py-3 md:py-4 text-base md:text-lg rounded-xl transition-all duration-300 font-poppins ${className}`}
      style={{
        backgroundColor: isHovered ? "transparent" : "#19181E",
        backgroundImage: isHovered
          ? "linear-gradient(to left, #33FF00, #187700)"
          : "none",
        border: "none",
        outline: isHovered ? "none" : "2px solid white",
        outlineOffset: "-2px",
        color: isHovered ? "#19181E" : "#F0F0F0",
        fontWeight: isHovered ? 700 : 600,
        boxShadow: isHovered
          ? "0 4px 30px rgba(51, 255, 0, 0.4), 0 5px 0 rgba(7, 59, 0, 1)"
          : "0 0 10px rgba(51, 255, 0, 0.4), 0 0 30px rgba(51, 255, 0, 0.3), inset 0 0 16px rgba(51, 255, 0, 0.4)",
      }}
    >
      {children}
    </button>
  );
}
