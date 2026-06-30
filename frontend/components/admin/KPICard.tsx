"use client";

import { cn } from "@/lib/utils";
import { Sparkline, SparklineData } from "@/components/charts";
import { LucideIcon } from "lucide-react";

export interface KPIProps {
  title: string;
  value: string | number;
  trend: {
    value: number;
    isPositive: boolean;
  };
  sparklineData: SparklineData[];
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  comparison?: string;
}

export function KPICard({ title, value, trend, sparklineData, icon: Icon, iconColor, iconBg, comparison }: KPIProps) {
  return (
    <div className="group rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_35px_rgba(15,23,42,.06)]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-[#64748B]">{title}</p>
          <p className="mt-2 text-3xl font-bold text-[#0F172A]">{value}</p>
          
          <div className="mt-2 flex items-center gap-2">
            <span className={cn(
              "inline-flex items-center gap-1 text-sm font-semibold",
              trend.isPositive ? "text-[#22C55E]" : "text-[#EF4444]"
            )}>
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
            {comparison && (
              <span className="text-sm text-[#64748B]">{comparison}</span>
            )}
          </div>
        </div>

        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", iconBg)}>
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
      </div>

      <div className="mt-4">
        <Sparkline data={sparklineData} color={iconColor.replace("text-", "#")} height={40} />
      </div>
    </div>
  );
}