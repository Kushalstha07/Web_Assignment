"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Users, FileText, TrendingUp, Building2, Sparkles, AlertTriangle, UserCheck, FileCheck } from "lucide-react";
import { KPICard } from "@/components/admin/KPICard";
import { AIInsights } from "@/components/admin/AIInsights";
import { SkeletonCard, SkeletonTable } from "@/components/ui/Skeleton";
import { SparklineData } from "@/components/charts";

export default function DashboardPage() {
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <SkeletonTable rows={5} columns={4} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Mock data - replace with actual API calls
  const kpiData = [
    {
      title: "Total Students",
      value: "2,847",
      trend: { value: 12.5, isPositive: true },
      sparklineData: [
        { value: 65 }, { value: 72 }, { value: 68 }, { value: 78 }, { value: 82 }, { value: 88 }, { value: 95 }
      ] as SparklineData[],
      icon: Users,
      iconColor: "text-[#2563EB]",
      iconBg: "bg-[#EEF5FF]",
      comparison: "vs last month",
    },
    {
      title: "Applications",
      value: "1,234",
      trend: { value: 8.2, isPositive: true },
      sparklineData: [
        { value: 40 }, { value: 45 }, { value: 42 }, { value: 50 }, { value: 55 }, { value: 58 }, { value: 62 }
      ] as SparklineData[],
      icon: FileText,
      iconColor: "text-[#7C3AED]",
      iconBg: "bg-purple-100",
      comparison: "vs last month",
    },
    {
      title: "Success Rate",
      value: "94.2%",
      trend: { value: 3.1, isPositive: true },
      sparklineData: [
        { value: 88 }, { value: 89 }, { value: 91 }, { value: 90 }, { value: 92 }, { value: 93 }, { value: 94 }
      ] as SparklineData[],
      icon: TrendingUp,
      iconColor: "text-[#22C55E]",
      iconBg: "bg-[#22C55E]/10",
      comparison: "vs last month",
    },
    {
      title: "Partner Universities",
      value: "156",
      trend: { value: 2.4, isPositive: true },
      sparklineData: [
        { value: 140 }, { value: 142 }, { value: 145 }, { value: 146 }, { value: 148 }, { value: 150 }, { value: 156 }
      ] as SparklineData[],
      icon: Building2,
      iconColor: "text-[#F59E0B]",
      iconBg: "bg-[#F59E0B]/10",
      comparison: "vs last month",
    },
  ];

  const aiInsights = [
    {
      icon: TrendingUp,
      text: "Student approval rate increased by 12% this week compared to last week",
      type: "success" as const,
    },
    {
      icon: AlertTriangle,
      text: "Visa delays detected for 3 students applying to UK universities",
      type: "warning" as const,
    },
    {
      icon: TrendingUp,
      text: "UK applications growing by 18% - highest in 6 months",
      type: "info" as const,
    },
    {
      icon: UserCheck,
      text: "AI recommends contacting 8 students with pending applications",
      type: "action" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0F172A]">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-[#64748B]">Welcome back! Here's what's happening with your consultancy today.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, idx) => (
          <KPICard key={idx} {...kpi} />
        ))}
      </div>

      {/* AI Insights Panel */}
      <AIInsights insights={aiInsights} onGenerateReport={() => alert("Generating report...")} />

      {/* Recent Activity & Quick Actions Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Students */}
        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#0F172A]">Recent Students</h3>
            <button className="text-sm font-semibold text-[#2563EB] hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {[
              { name: "John Smith", university: "University of Toronto", country: "Canada", status: "Active" },
              { name: "Sarah Johnson", university: "Stanford University", country: "USA", status: "Pending" },
              { name: "Michael Chen", university: "University of Melbourne", country: "Australia", status: "Active" },
            ].map((student, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-xl border border-[#E5E7EB] p-3 transition-all hover:border-[#2563EB]/30 hover:bg-[#F8FAFC]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-sm font-bold text-white">
                    {student.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">{student.name}</p>
                    <p className="text-xs text-[#64748B]">{student.university}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold ${student.status === "Active" ? "text-[#22C55E]" : "text-[#F59E0B]"}`}>
                  {student.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-[#0F172A]">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Users, label: "Add Student", color: "from-[#2563EB] to-[#7C3AED]" },
              { icon: FileText, label: "New Application", color: "from-[#22C55E] to-[#10B981]" },
              { icon: Building2, label: "Add University", color: "from-[#F59E0B] to-[#F97316]" },
              { icon: FileCheck, label: "Verify Documents", color: "from-[#7C3AED] to-[#2563EB]" },
            ].map((action, idx) => (
              <button
                key={idx}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] p-4 transition-all hover:-translate-y-0.5 hover:border-[#2563EB]/30 hover:shadow-md"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${action.color}`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-[#0F172A]">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications Overview */}
      <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#0F172A]">Applications Overview</h3>
          <div className="flex gap-2">
            <span className="rounded-full bg-[#22C55E]/10 px-3 py-1 text-xs font-semibold text-[#22C55E]">Approved: 456</span>
            <span className="rounded-full bg-[#F59E0B]/10 px-3 py-1 text-xs font-semibold text-[#F59E0B]">Pending: 234</span>
            <span className="rounded-full bg-[#EF4444]/10 px-3 py-1 text-xs font-semibold text-[#EF4444]">Rejected: 45</span>
          </div>
        </div>
        <div className="h-64 rounded-xl bg-[#F8FAFC] p-4">
          <div className="flex h-full items-center justify-center text-[#64748B]">
            <p>Application trend chart will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
}