"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getUniversities, getUniversitiesByCountry } from "@/lib/api/university.api";
import type { University, UniversityFilters } from "@/lib/api/university.api";
import { UniversityCard } from "@/components/university/UniversityCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { SkeletonCard } from "@/components/ui/Skeleton";
import {
  Search,
  SlidersHorizontal,
  X,
  MapPin,
  GraduationCap,
  DollarSign,
  Award,
  Building2,
  TrendingUp,
  ChevronDown,
} from "lucide-react";

const COUNTRIES = [
  { label: "All Countries", value: "" },
  { label: "🇺🇸 USA", value: "usa" },
  { label: "🇬🇧 UK", value: "uk" },
  { label: "🇨🇦 Canada", value: "canada" },
  { label: "🇦🇺 Australia", value: "australia" },
  { label: "🇩🇪 Germany", value: "germany" },
  { label: "🇫🇷 France", value: "france" },
];

const COURSE_TYPES = [
  { label: "All Programs", value: "" },
  { label: "Computer Science", value: "cs" },
  { label: "Business", value: "business" },
  { label: "Engineering", value: "engineering" },
  { label: "Medicine", value: "medicine" },
  { label: "Law", value: "law" },
  { label: "Arts", value: "arts" },
];

const BUDGET_RANGES = [
  { label: "Any Budget", value: "" },
  { label: "Under $10k", value: "under-10k" },
  { label: "$10k – $20k", value: "10k-20k" },
  { label: "$20k – $35k", value: "20k-35k" },
  { label: "$35k+", value: "35k-plus" },
];

const SCHOLARSHIP_OPTIONS = [
  { label: "All", value: "" },
  { label: "Merit-Based", value: "merit" },
  { label: "Need-Based", value: "need" },
  { label: "Sports", value: "sports" },
];

export default function UniversitiesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // State
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [country, setCountry] = useState("");
  const [courseType, setCourseType] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [scholarship, setScholarship] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState<UniversityFilters>({});

  const fetchUniversities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: UniversityFilters = {
        ...appliedFilters,
        page,
        limit: 12,
      };

      const response = await getUniversities(filters);
      if (response.success) {
        setUniversities(response.data);
        setTotal(response.meta?.total ?? 0);
        setTotalPages(response.meta?.totalPages ?? 1);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch universities");
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, page]);

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  // Apply filters
  const handleSearch = () => {
    const filters: UniversityFilters = {};
    if (searchQuery) filters.search = searchQuery;
    if (country) filters.country = country;
    if (courseType) filters.courseType = courseType;
    if (budgetRange) filters.budgetRange = budgetRange;
    setAppliedFilters(filters);
    setPage(1);
  };

  // Reset filters
  const handleReset = () => {
    setSearchQuery("");
    setCountry("");
    setCourseType("");
    setBudgetRange("");
    setScholarship("");
    setAppliedFilters({});
    setPage(1);
  };

  const activeFilterCount = [country, courseType, budgetRange].filter(Boolean).length;

  if (authLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-[#E5E7EB]" />
        <div className="h-12 w-full animate-pulse rounded-xl bg-[#E5E7EB]" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
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
      <div>
        <h1 className="text-3xl font-bold text-[#0F172A]">Find Your Perfect Fit</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Discover universities that match your academic profile and preferences.
        </p>
      </div>

      {/* Search Bar */}
      <Card padding="md" className="border border-[#E5E7EB]">
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search universities by name, program, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full rounded-[12px] border border-[#E5E7EB] bg-white py-3 pl-12 pr-4 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
            <Button onClick={handleSearch} className="h-12 shrink-0">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 shrink-0"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="info" size="sm" className="ml-2">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 grid gap-4 border-t border-[#E5E7EB] pt-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Country */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  <MapPin className="h-3.5 w-3.5" />
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#0F172A] focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Course Type */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  <GraduationCap className="h-3.5 w-3.5" />
                  Program
                </label>
                <select
                  value={courseType}
                  onChange={(e) => setCourseType(e.target.value)}
                  className="w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#0F172A] focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                >
                  {COURSE_TYPES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  <DollarSign className="h-3.5 w-3.5" />
                  Tuition Budget
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#0F172A] focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                >
                  {BUDGET_RANGES.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Scholarship */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  <Award className="h-3.5 w-3.5" />
                  Scholarship
                </label>
                <select
                  value={scholarship}
                  onChange={(e) => setScholarship(e.target.value)}
                  className="w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#0F172A] focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                >
                  {SCHOLARSHIP_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Active Filter Tags */}
          {activeFilterCount > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#E5E7EB] pt-4">
              <span className="text-xs text-[#64748B]">Active filters:</span>
              {country && (
                <Badge variant="info" size="sm" className="flex items-center gap-1">
                  {COUNTRIES.find((c) => c.value === country)?.label ?? country}
                  <button onClick={() => { setCountry(""); handleSearch(); }} className="ml-1 hover:text-white">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {courseType && (
                <Badge variant="info" size="sm" className="flex items-center gap-1">
                  {COURSE_TYPES.find((c) => c.value === courseType)?.label ?? courseType}
                  <button onClick={() => { setCourseType(""); handleSearch(); }} className="ml-1 hover:text-white">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {budgetRange && (
                <Badge variant="info" size="sm" className="flex items-center gap-1">
                  {BUDGET_RANGES.find((b) => b.value === budgetRange)?.label ?? budgetRange}
                  <button onClick={() => { setBudgetRange(""); handleSearch(); }} className="ml-1 hover:text-white">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-[#EF4444] hover:text-red-700"
              >
                Clear all
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Stats */}
      {!loading && !error && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#64748B]">
            Showing <strong className="text-[#0F172A]">{universities.length}</strong> of{" "}
            <strong className="text-[#0F172A]">{total}</strong> universities
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-[20px] border border-red-200 bg-red-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2">
              <X className="h-4 w-4 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">{error}</p>
              <button
                onClick={fetchUniversities}
                className="text-sm text-red-600 underline hover:text-red-800"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* University Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : universities.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center rounded-[20px] border border-[#E5E7EB] bg-white px-6 py-16">
          <Building2 className="h-16 w-16 text-[#D1D5DB]" />
          <h3 className="mt-4 text-lg font-bold text-[#0F172A]">No universities found</h3>
          <p className="mt-1 text-sm text-[#64748B]">
            Try adjusting your filters or search query.
          </p>
          <Button variant="secondary" className="mt-4" onClick={handleReset}>
            Reset Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {universities.map((uni) => (
              <UniversityCard
                key={uni.id}
                university={uni}
                onView={(id) => router.push(`/universities/${id}`)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === page ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                    className={pageNum === page ? "bg-[#2563EB]" : ""}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              {totalPages > 5 && <span className="text-sm text-[#64748B]">...</span>}
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}