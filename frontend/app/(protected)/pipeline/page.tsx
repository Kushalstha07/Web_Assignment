"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { StudentPipeline } from "@/components/admin/StudentPipeline";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Student } from "@/components/admin/StudentPipeline";

export default function PipelinePage() {
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
          <h1 className="text-3xl font-bold text-[#0F172A]">Student Pipeline</h1>
          <p className="mt-1 text-sm text-[#64748B]">Loading...</p>
        </div>
        <SkeletonCard />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Mock data - replace with actual API calls
  const mockStudents: Student[] = [
    {
      id: "1",
      name: "John Smith",
      email: "john@example.com",
      phone: "+1 234 567 8900",
      university: "University of Toronto",
      program: "MBA",
      stage: "Lead",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      university: "Stanford University",
      program: "MS Computer Science",
      stage: "Consultation",
    },
    {
      id: "3",
      name: "Michael Chen",
      email: "michael@example.com",
      phone: "+1 234 567 8901",
      university: "University of Melbourne",
      program: "MS Data Science",
      stage: "Application",
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily@example.com",
      university: "MIT",
      program: "PhD AI",
      stage: "Offer Letter",
    },
    {
      id: "5",
      name: "James Wilson",
      email: "james@example.com",
      phone: "+1 234 567 8902",
      university: "University of British Columbia",
      program: "MBA",
      stage: "Visa",
    },
    {
      id: "6",
      name: "Lisa Anderson",
      email: "lisa@example.com",
      university: "Harvard University",
      program: "MBA",
      stage: "Enrolled",
    },
    {
      id: "7",
      name: "David Brown",
      email: "david@example.com",
      university: "University of Toronto",
      program: "MS Engineering",
      stage: "Lead",
    },
    {
      id: "8",
      name: "Jennifer Taylor",
      email: "jennifer@example.com",
      phone: "+1 234 567 8903",
      university: "Stanford University",
      program: "MS Business",
      stage: "Consultation",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0F172A]">Student Pipeline</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Track and manage student applications through all stages
        </p>
      </div>

      {/* Pipeline Board */}
      <StudentPipeline students={mockStudents} />

      {/* Pipeline Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-[#64748B]">Conversion Rate</h3>
          <p className="mt-2 text-2xl font-bold text-[#0F172A]">68.5%</p>
          <p className="mt-1 text-xs text-[#22C55E]">↑ 5.2% from last month</p>
        </div>
        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-[#64748B]">Average Time in Pipeline</h3>
          <p className="mt-2 text-2xl font-bold text-[#0F172A]">14 days</p>
          <p className="mt-1 text-xs text-[#22C55E]">↓ 2 days improvement</p>
        </div>
        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-[#64748B]">Active Students</h3>
          <p className="mt-2 text-2xl font-bold text-[#0F172A]">247</p>
          <p className="mt-1 text-xs text-[#64748B]">Currently in pipeline</p>
        </div>
      </div>
    </div>
  );
}