"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Search, Filter, Award, DollarSign, Calendar, Users } from "lucide-react";

interface Scholarship {
  id: string;
  name: string;
  university: string;
  amount: string;
  deadline: string;
  eligibility: string;
  applicants: number;
  awarded: number;
  status: "active" | "closed" | "upcoming";
  description: string;
}

export default function ScholarshipsPage() {
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
          <h1 className="text-3xl font-bold text-[#0F172A]">Scholarships</h1>
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

  const mockScholarships: Scholarship[] = [
    {
      id: "1",
      name: "Merit Scholarship Program",
      university: "University of Toronto",
      amount: "$25,000",
      deadline: "Dec 15, 2025",
      eligibility: "GPA 3.5+",
      applicants: 234,
      awarded: 45,
      status: "active",
      description: "Full merit-based scholarship for outstanding academic performance",
    },
    {
      id: "2",
      name: "International Excellence Award",
      university: "Stanford University",
      amount: "$40,000",
      deadline: "Jan 01, 2026",
      eligibility: "GPA 3.8+",
      applicants: 456,
      awarded: 23,
      status: "active",
      description: " prestigious scholarship for international students with exceptional achievements",
    },
    {
      id: "3",
      name: "Research Fellowship",
      university: "MIT",
      amount: "$35,000",
      deadline: "Dec 01, 2025",
      eligibility: "Research Experience",
      applicants: 189,
      awarded: 12,
      status: "active",
      description: "Full funding for PhD students with strong research background",
    },
    {
      id: "4",
      name: "Diversity Leadership Grant",
      university: "Harvard University",
      amount: "$30,000",
      deadline: "Nov 30, 2025",
      eligibility: "Leadership + GPA 3.3+",
      applicants: 567,
      awarded: 67,
      status: "upcoming",
      description: "Supporting diverse leaders from around the world",
    },
    {
      id: "5",
      name: "Sports Excellence Scholarship",
      university: "University of Melbourne",
      amount: "$20,000",
      deadline: "Oct 31, 2025",
      eligibility: "Athletic Achievement",
      applicants: 145,
      awarded: 34,
      status: "active",
      description: "For student-athletes with outstanding sports achievements",
    },
    {
      id: "6",
      name: "Community Impact Award",
      university: "University of British Columbia",
      amount: "$15,000",
      deadline: "Sep 15, 2025",
      eligibility: "Community Service",
      applicants: 234,
      awarded: 56,
      status: "closed",
      description: "Recognizing students who made significant community impact",
    },
  ];

  const getStatusBadge = (status: Scholarship["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "closed":
        return <Badge variant="default">Closed</Badge>;
      case "upcoming":
        return <Badge variant="info">Upcoming</Badge>;
    }
  };

  const getTotalStats = () => {
    return {
      total: mockScholarships.length,
      active: mockScholarships.filter(s => s.status === "active").length,
      totalAmount: "$165,000",
      totalAwarded: mockScholarships.reduce((sum, s) => sum + s.awarded, 0),
    };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">Scholarships</h1>
          <p className="mt-1 text-sm text-[#64748B]">Discover and manage scholarship opportunities</p>
        </div>
        <Button>
          <Award className="h-4 w-4" />
          Add Scholarship
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#64748B]">Total Scholarships</p>
              <p className="mt-2 text-2xl font-bold text-[#0F172A]">{stats.total}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF5FF]">
              <Award className="h-6 w-6 text-[#2563EB]" />
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#64748B]">Active</p>
              <p className="mt-2 text-2xl font-bold text-[#0F172A]">{stats.active}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#22C55E]/10">
              <DollarSign className="h-6 w-6 text-[#22C55E]" />
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#64748B]">Total Value</p>
              <p className="mt-2 text-2xl font-bold text-[#0F172A]">{stats.totalAmount}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
              <DollarSign className="h-6 w-6 text-[#7C3AED]" />
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#64748B]">Students Awarded</p>
              <p className="mt-2 text-2xl font-bold text-[#0F172A]">{stats.totalAwarded}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F59E0B]/10">
              <Users className="h-6 w-6 text-[#F59E0B]" />
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
              placeholder="Search scholarships..."
              className="pl-10"
            />
          </div>
          <div className="flex gap-3">
            <select className="h-11 rounded-[12px] border border-[#E5E7EB] bg-white px-4 pr-10 text-sm text-[#0F172A] outline-none transition-all hover:border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15">
              <option>All Status</option>
              <option>Active</option>
              <option>Upcoming</option>
              <option>Closed</option>
            </select>
            <Button variant="secondary">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Scholarships Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockScholarships.map((scholarship) => (
          <Card key={scholarship.id} padding="none" className="overflow-hidden">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED]">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A]">{scholarship.name}</h3>
                    <p className="text-xs text-[#64748B]">{scholarship.university}</p>
                  </div>
                </div>
                {getStatusBadge(scholarship.status)}
              </div>

              {/* Amount */}
              <div className="mb-4">
                <p className="text-2xl font-bold text-[#22C55E]">{scholarship.amount}</p>
                <p className="text-xs text-[#64748B] mt-1">{scholarship.description}</p>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#64748B]">Eligibility</span>
                  <span className="font-semibold text-[#0F172A]">{scholarship.eligibility}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#64748B]">Deadline</span>
                  <span className="font-semibold text-[#0F172A]">{scholarship.deadline}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#64748B]">Applicants</span>
                  <span className="font-semibold text-[#0F172A]">{scholarship.applicants}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#64748B]">Awarded</span>
                  <span className="font-semibold text-[#22C55E]">{scholarship.awarded}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button size="sm" className="flex-1">
                  Apply Now
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}