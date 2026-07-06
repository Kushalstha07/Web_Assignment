"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-sm font-medium text-[#0F172A]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "min-h-[100px] w-full rounded-[12px] border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition-all resize-y",
            "placeholder:text-[#94A3B8]",
            "hover:border-[#CBD5E1]",
            "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/15",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-[#EF4444]">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };