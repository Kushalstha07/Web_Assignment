import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, type = "text", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-sm font-medium text-[#0F172A]">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              "h-11 w-full rounded-[12px] border border-[#DDE5EF] bg-white px-4 text-sm text-[#0F172A] outline-none transition-[border-color,box-shadow,background-color]",
              "placeholder:text-[#94A3B8]",
              "hover:border-[#B8C5D6]",
              "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15",
              "disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-10",
              error && "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/15",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-[#EF4444]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
