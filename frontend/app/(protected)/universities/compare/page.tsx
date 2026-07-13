"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { getUniversityById, getUniversities } from "@/lib/api/university.api";
import type { University } from "@/lib/api/university.api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SkeletonCard } from "@/components/ui/Skeleton";
import {
  ArrowLeft,
  Plus,
  X,
  TrendingUp,
  GraduationCap,
  DollarSign,
  Star,
  MapPin,
  Sparkles,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

interface ComparisonMetric {
  key: string;
  label: string;
  icon: LucideIcon;
  value: (university: University) => string | number;
  numeric?: (university: University) => number | undefined;
}

const COMPARISON_METRICS: ComparisonMetric[] = [
  { key: "worldRanking", label: "World Ranking", icon: BarChart3, value: (university: University) => university.worldRanking ?? "—", numeric: (university: University) => university.worldRanking },
  { key: "tuitionFee", label: "Tuition (Annual)", icon: DollarSign, value: (university: University) => `$${university.tuitionFee.toLocaleString()}`, numeric: (university: University) => university.tuitionFee },
  { key: "rating", label: "Rating", icon: Star, value: (university: University) => university.rating == null ? "—" : `${university.rating.toFixed(1)} / 5.0`, numeric: (university: University) => university.rating },
  { key: "matchScore", label: "Match Score", icon: TrendingUp, value: (university: University) => university.matchScore == null ? "—" : `${university.matchScore}%`, numeric: (university: University) => university.matchScore },
  { key: "programs", label: "Programs Available", icon: GraduationCap, value: (university: University) => `${university.programs.length} programs` },
  { key: "city", label: "Location", icon: MapPin, value: (university: University) => university.city },
];

export default function ComparePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load universities from URL params or allow user to search
  useEffect(() => {
    const ids = searchParams.get("ids");
    if (ids) {
      const idList = ids.split(",").slice(0, 4);
      Promise.all(idList.map((id) => getUniversityById(id).then((r) => r.data)))
        .then((results) => {
          setUniversities(results);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || "Failed to load universities");
          setLoading(false);
        });
    } else {
      // Load first 3 universities by default for comparison demo
      getUniversities({ limit: 3 })
        .then((res) => {
          if (res.success) {
            setUniversities(res.data.slice(0, 3));
          }
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || "Failed to load universities");
          setLoading(false);
        });
    }
  }, [searchParams]);

  const removeUniversity = (id: string) => {
    setUniversities((prev) => prev.filter((u) => u.id !== id));
  };

  if (authLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-[#E5E7EB]" />
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => router.push("/universities")}
            className="mb-3 flex items-center gap-1.5 text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Universities
          </button>
          <h1 className="text-3xl font-bold text-[#0F172A]">Compare Institutions</h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Side-by-side comparison of {universities.length} universities
          </p>
        </div>
        {universities.length < 4 && (
          <Button
            variant="secondary"
            onClick={() => router.push("/universities?mode=compare")}
            className="shrink-0"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add University
          </Button>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-[20px] border border-red-200 bg-red-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2">
              <X className="h-4 w-4 text-red-600" />
            </div>
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : universities.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[20px] border border-[#E5E7EB] bg-white px-6 py-16">
          <Plus className="h-16 w-16 text-[#D1D5DB]" />
          <h3 className="mt-4 text-lg font-bold text-[#0F172A]">No universities to compare</h3>
          <p className="mt-1 text-sm text-[#64748B]">
            Add universities from the search page to compare them side by side.
          </p>
          <Button className="mt-4" onClick={() => router.push("/universities")}>
            Browse Universities
          </Button>
        </div>
      ) : (
        <>
          {/* AI Expert Insight Panel */}
          {universities.length >= 2 && (
            <Card padding="md" className="border border-[#7C3AED]/20 bg-gradient-to-r from-[#7C3AED]/5 to-[#2563EB]/5">
              <CardContent className="p-0">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br from-[#7C3AED] to-[#2563EB]">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">AI Expert Insight</h3>
                    <p className="mt-1 text-sm text-[#64748B]">
                      Based on your academic profile,{" "}
                      <strong className="text-[#2563EB]">{universities[0]?.name}</strong> offers the best
                      overall match with higher ranking and program variety.{" "}
                      <strong className="text-[#7C3AED]">{universities[1]?.name}</strong> is more
                      budget-friendly while still maintaining strong academic standards.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comparison Grid */}
          <div className="overflow-x-auto">
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `200px repeat(${universities.length}, minmax(250px, 1fr))`,
              }}
            >
              {/* Header Row */}
              <>
                <div className="rounded-[12px] bg-[#F8FAFC] p-4" />
                {universities.map((uni) => (
                  <div
                    key={uni.id}
                    className="relative rounded-[20px] border border-[#E5E7EB] bg-white p-4 shadow-sm"
                  >
                    <button
                      onClick={() => removeUniversity(uni.id)}
                      className="absolute right-3 top-3 rounded-full p-1 text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#EF4444] transition-colors"
                      title="Remove from comparison"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="flex flex-col items-center text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-xl text-white">
                        {uni.country === "usa" ? "🇺🇸" : uni.country === "uk" ? "🇬🇧" : uni.country === "canada" ? "🇨🇦" : uni.country === "australia" ? "🇦🇺" : "🏛️"}
                      </div>
                      <h3 className="mt-3 text-sm font-bold text-[#0F172A]">{uni.name}</h3>
                      <p className="text-xs text-[#64748B]">
                        {uni.city}, {uni.country.toUpperCase()}
                      </p>
                      <Badge variant="info" className="mt-2">
                        #{uni.worldRanking ?? "—"} Globally
                      </Badge>
                      {uni.matchScore && (
                        <div className="mt-3 flex items-center gap-1.5">
                          <div className="h-2 w-full max-w-[100px] rounded-full bg-[#E5E7EB]">
                            <div
                              className="h-2 rounded-full bg-[#2563EB]"
                              style={{ width: `${uni.matchScore}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-[#2563EB]">{uni.matchScore}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </>

              {/* Metric Rows */}
              {COMPARISON_METRICS.map((metric) => {
                const Icon = metric.icon;
                const values = universities.map(metric.value);

                // Find best value for highlighting
                const numericValues = metric.numeric
                  ? universities
                      .map((university, idx) => ({ val: metric.numeric?.(university), idx }))
                      .filter((item): item is { val: number; idx: number } => typeof item.val === "number" && !Number.isNaN(item.val))
                  : [];

                const bestIdx =
                  numericValues.length > 0
                    ? metric.key === "tuitionFee"
                      ? numericValues.reduce((a, b) => (a.val < b.val ? a : b)).idx // lowest tuition is best
                      : numericValues.reduce((a, b) => (a.val > b.val ? a : b)).idx
                    : -1;

                return (
                  <>
                    {/* Label */}
                    <div className="flex items-center gap-2 rounded-[12px] bg-[#F8FAFC] px-4 py-5">
                      <Icon className="h-4 w-4 text-[#64748B]" />
                      <span className="text-sm font-semibold text-[#0F172A]">{metric.label}</span>
                    </div>

                    {/* Values */}
                    {values.map((val, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-center rounded-[12px] px-4 py-5 ${
                          bestIdx === idx ? "bg-[#EEF5FF]" : "bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-semibold ${
                              bestIdx === idx ? "text-[#2563EB]" : "text-[#0F172A]"
                            }`}
                          >
                            {val}
                          </span>
                          {bestIdx === idx && (
                            <Badge variant="success" size="sm">Best</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                );
              })}

              {/* Programs Row */}
              <>
                <div className="flex items-center gap-2 rounded-[12px] bg-[#F8FAFC] px-4 py-5">
                  <GraduationCap className="h-4 w-4 text-[#64748B]" />
                  <span className="text-sm font-semibold text-[#0F172A]">Programs</span>
                </div>
                {universities.map((uni, idx) => (
                  <div key={idx} className="flex flex-wrap justify-center gap-2 rounded-[12px] bg-white px-4 py-5">
                    {uni.programs.slice(0, 4).map((p) => (
                      <span
                        key={p}
                        className="rounded-[8px] bg-[#EEF5FF] px-2 py-1 text-xs font-medium text-[#2563EB]"
                      >
                        {p}
                      </span>
                    ))}
                    {uni.programs.length > 4 && (
                      <span className="rounded-[8px] bg-[#F1F5F9] px-2 py-1 text-xs text-[#64748B]">
                        +{uni.programs.length - 4}
                      </span>
                    )}
                  </div>
                ))}
              </>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <Button onClick={() => router.push("/universities")}>
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to Search
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                const ids = universities.map((u) => u.id).join(",");
                navigator.clipboard.writeText(
                  `${window.location.origin}/universities/compare?ids=${ids}`
                );
                alert("Comparison link copied to clipboard!");
              }}
            >
              Share Comparison
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
