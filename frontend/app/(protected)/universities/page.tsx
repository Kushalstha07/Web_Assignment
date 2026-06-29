"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Search, Filter, Globe, BookOpen, DollarSign, Award, Calendar } from "lucide-react";

interface University {
  id: string;
  name: string;
  country: string;
  ranking: number;
  acceptanceRate: number;
  programs: number;
  commission: string;
  applications: number;
  partnerStatus: "active" | "pending" | "inactive";
  scholarships: boolean;
  deadline: string;
  logo?: string;
}

export default function UniversitiesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">Universities</h1>
          <p className="mt-1 text-sm text-[#64748B]">Loading...</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const mockUniversities: University[] = [
    {
      id: "1",
      name: "University of Toronto",
      country: "Canada",
      ranking: 18,
      acceptanceRate: 43,
      programs: 200,
      commission: "15%",
      applications: 234,
      partnerStatus: "active",
      scholarships: true,
      deadline: "Dec 15, 2025",
    },
    {
      id: "2",
      name: "Stanford University",
      country: "USA",
      ranking: 3,
      acceptanceRate: 4,
      programs: 150,
      commission: "12%",
      applications: 456,
      partnerStatus: "active",
      scholarships: true,
      deadline: "Jan 01, 2026",
    },
    {
      id: "3",
      name: "University of Melbourne",
      country: "Australia",
      ranking: 14,
      acceptanceRate: 70,
      programs: 180,
      commission: "10%",
      applications: 189,
      partnerStatus: "active",
      scholarships: true,
      deadline: "Oct 31, 2025",
    },
    {
      id: "4",
      name: "MIT",
      country: "USA",
      ranking: 1,
      acceptanceRate: 3,
      programs: 120,
      commission: "18%",
      applications: 567,
      partnerStatus: "active",
      scholarships: true,
      deadline: "Dec 01, 2025",
    },
    {
      id: "5",
      name: "University of British Columbia",
      country: "Canada",
      ranking: 34,
      acceptanceRate: 52,
      programs: 250,
      commission: "14%",
      applications: 145,
      partnerStatus: "pending",
      scholarships: false,
      deadline: "Nov 30, 2025",
    },
    {
      id: "6",
      name: "Harvard University",
      country: "USA",
      ranking: 2,
      acceptanceRate: 5,
      programs: 100,
      commission: "20%",
      applications: 678,
      partnerStatus: "active",
      scholarships: true,
      deadline: "Jan 15, 2026",
    },
  ];

  const getStatusBadge = (status: University["partnerStatus"]) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active Partner</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "inactive":
        return <Badge variant="default">Inactive</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0F172A]">Universities</h1>
        <p className="mt-1 text-sm text-[#64748B]">Manage partner universities and their programs</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#64748B]">Total Partners</p>
              <p className="mt-2 text-2xl font-bold text-[#0F172A]">156</p>
              <p className="mt-1 text-xs text-[#22C55E]">↑ 12 new this month</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF5FF]">
              <Globe className="h-6 w-6 text-[#2563EB]" />
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#64748B]">Total Programs</p>
              <p className="mt-2 text-2xl font-bold text-[#0F172A]">3,450</p>
              <p className="mt-1 text-xs text-[#22C55E]">↑ 89 new programs</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
              <BookOpen className="h-6 w-6 text-[#7C3AED]" />
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#64748B]">Applications</p>
              <p className="mt-2 text-2xl font-bold text-[#0F172A]">1,234</p>
              <p className="mt-1 text-xs text-[#22C55E]">↑ 8.2% this month</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#22C55E]/10">
              <Award className="h-6 w-6 text-[#22C55E]" />
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#64748B]">Avg. Commission</p>
              <p className="mt-2 text-2xl font-bold text-[#0F172A]">14.5%</p>
              <p className="mt-1 text-xs text-[#64748B]">Across all partners</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F59E0B]/10">
              <DollarSign className="h-6 w-6 text-[#F59E0B]" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card padding="md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
            <Input
              placeholder="Search universities..."
              className="pl-10"
            />
          </div>
          <div className="flex gap-3">
            <select className="h-11 rounded-[12px] border border-[#E5E7EB] bg-white px-4 pr-10 text-sm text-[#0F172A] outline-none transition-all hover:border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15">
              <option>All Countries</option>
              <option>USA</option>
              <option>Canada</option>
              <option>Australia</option>
              <option>UK</option>
            </select>
            <select className="h-11 rounded-[12px] border border-[#E5E7EB] bg-white px-4 pr-10 text-sm text-[#0F172A] outline-none transition-all hover:border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15">
              <option>All Status</option>
              <option>Active</option>
              <option>Pending</option>
            </select>
            <Button variant="secondary">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Universities Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockUniversities.map((university) => (
          <Card key={university.id} padding="none" className="overflow-hidden">
            <div className="p-6">
              {/* University Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-lg font-bold text-white">
                    {university.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A]">{university.name}</h3>
                    <p className="text-xs text-[#64748B]">{university.country}</p>
                  </div>
                </div>
                {getStatusBadge(university.partnerStatus)}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-[#64748B]">Ranking</p>
                  <p className="text-sm font-bold text-[#0F172A]">#{university.ranking}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Acceptance Rate</p>
                  <p className="text-sm font-bold text-[#0F172A]">{university.acceptanceRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Programs</p>
                  <p className="text-sm font-bold text-[#0F172A]">{university.programs}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Commission</p>
                  <p className="text-sm font-bold text-[#0F172A]">{university.commission}</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#64748B]">Applications</span>
                  <span className="font-semibold text-[#0F172A]">{university.applications}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#64748B]">Scholarships</span>
                  <span className="font-semibold text-[#0F172A]">{university.scholarships ? "Available" : "Not Available"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#64748B]">Deadline</span>
                  <span className="font-semibold text-[#0F172A]">{university.deadline}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button size="sm" className="flex-1">
                  Apply
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}