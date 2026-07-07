"use client";

import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  value: number; // 0–100
  variant?: "primary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const variantClasses: Record<string, string> = {
  primary: "bg-[#2563EB]",
  success: "bg-[#22C55E]",
  warning: "bg-[#F59E0B]",
  danger: "bg-[#EF4444]",
};

const sizeClasses: Record<string, string> = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function ProgressBar({
  value,
  variant = "primary",
  size = "md",
  showLabel = false,
  className,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-medium text-[#64748B]">Progress</span>
          <span className="text-xs font-semibold text-[#0F172A]">{Math.round(clampedValue)}%</span>
        </div>
      )}
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-[#E5E7EB]",
          sizeClasses[size],
        )}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variantClasses[variant],
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}