"use client";

import { cn } from "@/lib/utils";
import { Sparkles, TrendingUp, AlertTriangle, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface Insight {
  icon: React.ElementType;
  text: string;
  type: "info" | "success" | "warning" | "action";
}

export interface AIInsightsProps {
  insights: Insight[];
  onGenerateReport?: () => void;
}

export function AIInsights({ insights, onGenerateReport }: AIInsightsProps) {
  const getInsightColor = (type: Insight["type"]) => {
    switch (type) {
      case "success":
        return "text-[#22C55E] bg-[#22C55E]/10";
      case "warning":
        return "text-[#F59E0B] bg-[#F59E0B]/10";
      case "action":
        return "text-[#7C3AED] bg-[#7C3AED]/10";
      default:
        return "text-[#2563EB] bg-[#2563EB]/10";
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[20px] border border-[#E5E7EB] bg-gradient-to-br from-[#7C3AED]/5 to-[#2563EB]/5 p-6 shadow-sm">
      {/* AI Animation Background */}
      <div className="absolute inset-0 overflow-hidden rounded-[20px]">
        <div className="absolute -right-10 -top-10 h-40 w-40 animate-pulse rounded-full bg-[#7C3AED]/10" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 animate-pulse rounded-full bg-[#2563EB]/10" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#2563EB]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">AI Insights</h3>
              <p className="text-xs text-[#64748B]">Real-time analytics & recommendations</p>
            </div>
          </div>
          {onGenerateReport && (
            <Button variant="secondary" size="sm" onClick={onGenerateReport}>
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
          )}
        </div>

        {/* Insights List */}
        <div className="space-y-3">
          {insights.map((insight, idx) => {
            const Icon = insight.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl bg-white/80 p-3 backdrop-blur-sm transition-all hover:bg-white"
              >
                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", getInsightColor(insight.type))}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="flex-1 text-sm text-[#0F172A]">{insight.text}</p>
              </div>
            );
          })}
        </div>

        {/* AI Badge */}
        <div className="mt-4 flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-[#7C3AED]/10 px-3 py-1">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7C3AED]" />
            <span className="text-xs font-semibold text-[#7C3AED]">AI Powered</span>
          </div>
        </div>
      </div>
    </div>
  );
}