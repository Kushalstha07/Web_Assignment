import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

const Skeleton = ({ className, variant = "rectangular", width, height, ...props }: SkeletonProps) => {
  const baseStyles = "animate-pulse bg-[#E2E8F0]";

  const variants = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-[12px]",
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      style={style}
      {...props}
    />
  );
};

export { Skeleton };

// Preset skeleton components
export const SkeletonText = ({ lines = 3, className }: { lines?: number; className?: string }) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        height={i === lines - 1 ? "12px" : "16px"}
        className={i === lines - 1 ? "w-2/3" : "w-full"}
      />
    ))}
  </div>
);

export const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={cn("rounded-[20px] border border-[#E5E7EB] bg-white p-6", className)}>
    <Skeleton variant="rectangular" height="120px" className="mb-4" />
    <Skeleton variant="text" height="20px" className="mb-2 w-3/4" />
    <Skeleton variant="text" height="16px" className="w-1/2" />
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => (
  <div className="rounded-[20px] border border-[#E5E7EB] bg-white">
    <div className="border-b border-[#E5E7EB] bg-[#F8FAFC] p-4">
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" height="14px" className="flex-1" />
        ))}
      </div>
    </div>
    <div className="divide-y divide-[#E5E7EB]">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" height="16px" className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  </div>
);