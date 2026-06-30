import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "purple";
  size?: "sm" | "md";
}

const Badge = ({ className, variant = "default", size = "sm", children, ...props }: BadgeProps) => {
  const baseStyles = "inline-flex items-center gap-1.5 rounded-full font-semibold";

  const variants = {
    default: "bg-[#F1F5F9] text-[#64748B]",
    success: "bg-[#22C55E]/10 text-[#22C55E]",
    warning: "bg-[#F59E0B]/10 text-[#F59E0B]",
    danger: "bg-[#EF4444]/10 text-[#EF4444]",
    info: "bg-[#2563EB]/10 text-[#2563EB]",
    purple: "bg-purple-100 text-purple-700",
  };

  const sizes = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};

export { Badge };