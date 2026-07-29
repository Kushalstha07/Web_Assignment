import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const Avatar = ({ className, src, alt = "User", fallback, size = "md", ...props }: AvatarProps) => {
  const [imageError, setImageError] = useState(false);

  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] font-bold text-white",
        sizes[size],
        className
      )}
      {...props}
    >
      {src && !imageError ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={size === "sm" ? "32px" : size === "md" ? "40px" : size === "lg" ? "48px" : "64px"}
          unoptimized
          className="object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span>{fallback ? getInitials(fallback) : alt.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
};

Avatar.displayName = "Avatar";

export { Avatar };
