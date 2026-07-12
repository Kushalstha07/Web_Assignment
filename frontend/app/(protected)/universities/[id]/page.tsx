"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { getUniversityById } from "@/lib/api/university.api";
import type { University } from "@/lib/api/university.api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SkeletonCard } from "@/components/ui/Skeleton";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Star,
  GraduationCap,
  TrendingUp,
  Globe,
  Award,
  Calendar,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Share2,
  Heart,
  Building2,
  BarChart3,
} from "lucide-react";

const countryFlags: Record<string, string> = {
  usa: "🇺🇸",
  uk: "🇬🇧",
  canada: "🇨🇦",
  australia: "🇦🇺",
  europe: "🇪🇺",
  germany: "🇩🇪",
  france: "🇫🇷",
};

const budgetLabels: Record<string, string> = {
  "under-10k": "Under $10k",
  "10k-20k": "$10k – $20k",
  "20k-35k": "$20k – $35k",
  "35k-plus": "$35k+",
};

export default function UniversityDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const fetchUniversity = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUniversityById(id);
      if (response.success) {
        setUniversity(response.data);
      } else {
        setError("University not found");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load university details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchUniversity();
  }, [id, fetchUniversity]);

  if (authLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-[#E5E7EB]" />
        <div className="h-64 w-full animate-pulse rounded-[20px] bg-[#E5E7EB]" />
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-[#E5E7EB]" />
        <div className="h-64 w-full animate-pulse rounded-[20px] bg-[#E5E7EB]" />
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !university) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.push("/universities")}
          className="flex items-center gap-1.5 text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Universities
        </button>
        <div className="flex flex-col items-center justify-center rounded-[20px] border border-[#E5E7EB] bg-white px-6 py-16">
          <Building2 className="h-16 w-16 text-[#D1D5DB]" />
          <h3 className="mt-4 text-lg font-bold text-[#0F172A]">
            {error || "University not found"}
          </h3>
          <p className="mt-1 text-sm text-[#64748B]">
            The university you're looking for doesn't exist or has been removed.
          </p>
          <Button className="mt-4" onClick={() => router.push("/universities")}>
            Browse Universities
          </Button>
        </div>
      </div>
    );
  }

  const matchScore = university.matchScore ?? 0;
  const rating = university.rating ?? 0;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.push("/universities")}
        className="flex items-center gap-1.5 text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Universities
      </button>

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#2563EB] to-[#7C3AED] p-8 text-white">
        <div className="absolute right-0 top-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-1/2 h-48 w-48 -translate-x-1/2 translate-y-16 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[20px] bg-white/20 text-3xl backdrop-blur-sm">
              {countryFlags[university.country] || "🏛️"}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{university.name}</h1>
              <p className="mt-1 text-white/80">
                {university.city}, {university.country.toUpperCase()}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="info" className="bg-white/20 text-white border-0">
                  #{university.worldRanking ?? "—"} World Ranking
                </Badge>
                <Badge variant="info" className="bg-white/20 text-white border-0">
                  {university.courseType}
                </Badge>
                {university.budgetRange && (
                  <Badge variant="info" className="bg-white/20 text-white border-0">
                    {budgetLabels[university.budgetRange] ?? university.budgetRange}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => setSaved(!saved)}
              className="bg-white/20 text-white border-0 hover:bg-white/30"
            >
              <Heart className={`h-4 w-4 ${saved ? "fill-red-500 text-red-500" : ""}`} />
              {saved ? "Saved" : "Save"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied!");
              }}
              className="bg-white/20 text-white border-0 hover:bg-white/30"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Key Stats */}
        <div className="space-y-6 lg:col-span-2">
          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card padding="md">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF5FF]">
                  <DollarSign className="h-6 w-6 text-[#2563EB]" />
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Annual Tuition</p>
                  <p className="text-lg font-bold text-[#0F172A]">
                    ${university.tuitionFee.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>

            <Card padding="md">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0FDF4]">
                  <TrendingUp className="h-6 w-6 text-[#22C55E]" />
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Match Score</p>
                  <p className="text-lg font-bold text-[#2563EB]">{matchScore}%</p>
                </div>
              </div>
            </Card>

            <Card padding="md">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF9EE]">
                  <Star className="h-6 w-6 text-[#F59E0B]" />
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Rating</p>
                  <p className="text-lg font-bold text-[#0F172A]">{rating.toFixed(1)}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Description */}
          {university.description && (
            <Card padding="md">
              <h3 className="mb-3 text-lg font-bold text-[#0F172A]">About</h3>
              <p className="text-sm leading-relaxed text-[#64748B]">{university.description}</p>
            </Card>
          )}

          {/* Programs */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#0F172A]">Programs Offered</h3>
              <Badge variant="info">{university.programs.length} programs</Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {university.programs.map((program) => (
                <div
                  key={program}
                  className="flex items-center gap-3 rounded-[12px] border border-[#E5E7EB] p-3 transition-all hover:border-[#2563EB]/30 hover:bg-[#F8FAFC]"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF5FF]">
                    <BookOpen className="h-4 w-4 text-[#2563EB]" />
                  </div>
                  <span className="text-sm font-medium text-[#0F172A]">{program}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Application Fee & Details */}
          {university.applicationFee && (
            <Card padding="md">
              <h3 className="mb-4 text-lg font-bold text-[#0F172A]">Application Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-[12px] bg-[#F8FAFC] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[#64748B]" />
                    <span className="text-sm text-[#64748B]">Application Fee</span>
                  </div>
                  <span className="text-sm font-semibold text-[#0F172A]">
                    ${university.applicationFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-[12px] bg-[#F8FAFC] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#64748B]" />
                    <span className="text-sm text-[#64748B]">Intake</span>
                  </div>
                  <span className="text-sm font-semibold text-[#0F172A]">Fall 2025 / Spring 2026</span>
                </div>
                <div className="flex items-center justify-between rounded-[12px] bg-[#F8FAFC] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-[#64748B]" />
                    <span className="text-sm text-[#64748B]">Location</span>
                  </div>
                  <span className="text-sm font-semibold text-[#0F172A]">
                    {university.city}, {university.country.toUpperCase()}
                  </span>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Match Score Card */}
          <Card padding="md" className="border border-[#2563EB]/20 bg-gradient-to-br from-[#EEF5FF] to-white">
            <div className="flex flex-col items-center text-center">
              <div className="relative h-24 w-24">
                <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
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
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#2563EB]">{matchScore}%</span>
                </div>
              </div>
              <h3 className="mt-3 text-lg font-bold text-[#0F172A]">Profile Match</h3>
              <p className="mt-1 text-xs text-[#64748B]">
                Based on your academic profile and preferences
              </p>
              <Button className="mt-4 w-full" size="sm">
                Apply Now
              </Button>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card padding="md">
            <h3 className="mb-4 text-sm font-bold text-[#0F172A] uppercase tracking-wider">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => router.push(`/universities/compare?ids=${university.id}`)}
                className="flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm font-medium text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-all"
              >
                <BarChart3 className="h-4 w-4" />
                Compare with Others
              </button>
              <button className="flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm font-medium text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-all">
                <Award className="h-4 w-4" />
                View Scholarships
              </button>
              <button className="flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm font-medium text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-all">
                <Calendar className="h-4 w-4" />
                Book Appointment
              </button>
              <button className="flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm font-medium text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-all">
                <ExternalLink className="h-4 w-4" />
                Visit Website
              </button>
            </div>
          </Card>

          {/* Rating Breakdown */}
          <Card padding="md">
            <h3 className="mb-4 text-sm font-bold text-[#0F172A] uppercase tracking-wider">Rating</h3>
            <div className="flex items-center gap-2 mb-3">
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
              <span className="text-sm font-bold text-[#0F172A]">{rating.toFixed(1)}</span>
            </div>
            <div className="space-y-2">
              {[
                { label: "Academics", value: 4.5 },
                { label: "Facilities", value: 4.2 },
                { label: "Location", value: 4.0 },
                { label: "Value", value: 3.8 },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="w-20 text-xs text-[#64748B]">{item.label}</span>
                  <div className="h-1.5 flex-1 rounded-full bg-[#E5E7EB]">
                    <div
                      className="h-1.5 rounded-full bg-[#F59E0B]"
                      style={{ width: `${(item.value / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-[#0F172A]">{item.value.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}