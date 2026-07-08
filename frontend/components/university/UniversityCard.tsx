"use client";

import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import type { University } from "@/lib/api/university.api";

interface UniversityCardProps {
  university: University;
  onView?: (id: string) => void;
}

const countryFlags: Record<string, string> = {
  usa: "🇺🇸",
  uk: "🇬🇧",
  canada: "🇨🇦",
  australia: "🇦🇺",
  europe: "🇪🇺",
};

const budgetLabels: Record<string, string> = {
  "under-10k": "Under $10k",
  "10k-20k": "$10k–20k",
  "20k-35k": "$20k–35k",
  "35k-plus": "$35k+",
};

export function UniversityCard({ university, onView }: UniversityCardProps) {
  const matchScore = university.matchScore ?? 0;
  const rating = university.rating ?? 0;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E5E7EB] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-xl text-white">
              {countryFlags[university.country] || "🏛️"}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">{university.name}</h3>
              <p className="text-xs text-[#64748B]">{university.city}, {university.country.toUpperCase()}</p>
            </div>
          </div>
          <Badge variant="info">
            #{university.worldRanking ?? "—"}
          </Badge>
        </div>

        {/* Body */}
        <div className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#64748B]">Tuition</span>
            <span className="text-sm font-semibold text-[#0F172A]">
              ${university.tuitionFee.toLocaleString()}/yr
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-[#64748B]">Budget</span>
            <span className="text-sm font-medium text-[#0F172A]">
              {budgetLabels[university.budgetRange] ?? university.budgetRange}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-[#64748B]">Rating</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= Math.round(rating) ? "text-[#F59E0B]" : "text-[#E5E7EB]"}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs font-medium text-[#0F172A]">{rating.toFixed(1)}</span>
          </div>

          {/* Match Score Ring */}
          <div className="mt-3 flex items-center justify-between rounded-[12px] bg-[#F5F7FA] p-3">
            <div>
              <p className="text-xs font-medium text-[#64748B]">Match Score</p>
              <p className="text-lg font-bold text-[#2563EB]">{matchScore}%</p>
            </div>
            <div className="h-10 w-10">
              <svg viewBox="0 0 36 36" className="h-10 w-10 -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="3"
                  strokeDasharray={`${matchScore} 100`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Programs */}
          <div className="flex flex-wrap gap-1">
            {university.programs.slice(0, 3).map((p) => (
              <span
                key={p}
                className="rounded-[8px] bg-[#EEF5FF] px-2 py-1 text-xs font-medium text-[#2563EB]"
              >
                {p}
              </span>
            ))}
            {university.programs.length > 3 && (
              <span className="rounded-[8px] bg-[#F1F5F9] px-2 py-1 text-xs text-[#64748B]">
                +{university.programs.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#E5E7EB] p-4">
          <button
            onClick={() => onView?.(university.id)}
            className="w-full rounded-[12px] bg-[#2563EB] py-2 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8]"
          >
            View Details
          </button>
        </div>
      </CardContent>
    </Card>
  );
}