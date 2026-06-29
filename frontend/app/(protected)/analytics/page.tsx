"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { BarChart } from "@/components/charts/BarChart";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { BarChartData } from "@/components/charts";
import { TrendingUp, Users, FileCheck, DollarSign, Award, Globe } from "lucide-react";

export default function AnalyticsPage() {
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
          <h1 className="text-3xl font-bold text-[#0F172A]">Analytics</h1>
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

  const monthlyApplicationsData: BarChartData[] = [
    { name: "Jan", value: 65, color: "#2563EB" },
    { name: "Feb", value: 78, color: "#2563EB" },
    { name: "Mar", value: 90, color: "#2563EB" },
    { name: "Apr", value: 81, color: "#2563EB" },
    { name: "May", value: 95, color: "#2563EB" },
    { name: "Jun", value: 110, color: "#2563EB" },
  ];

  const admissionRateData: BarChartData[] = [
    { name: "Week 1", value: 85, color: "#22C55E" },
    { name: "Week 2", value: 88, color: "#22C55E" },
    { name: "Week 3", value: 92, color: "#22C55E" },
    { name: "Week 4", value: 89, color: "#22C55E" },
  ];

  const visaSuccessData: BarChartData[] = [
    { name: "Canada", value: 94, color: "#7C3AED" },
    { name: "USA", value: 91, color: "#7C3AED" },
    { name: "UK", value: 88, color: "#7C3AED" },
    { name: "Australia", value: 93, color: "#7C3AED" },
  ];

  const revenueData: BarChartData[] = [
    { name: "Jan", value: 45000, color: "#F59E0B" },
    { name: "Feb", value: 52000, color: "#F59E0B" },
    { name: "Mar", value: 48000, color: "#F59E0B" },
    { name: "Apr", value: 61000, color: "#F59E0B" },
    { name: "May", value: 55000, color: "#F59E0B" },
    { name: "Jun", value: 67000, color: "#F59E0B" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0F172A]">Analytics Dashboard</h1>
        <p className="mt-1 text-sm text-[#64748B]">Track performance metrics and insights</p>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#64748B]">Total Revenue</p>
              <p className="mt-2 text-2xl font-bold text-[#0F172A]">$328K</p>
              <p className="mt-1 text-xs text-[#22C55E]">↑ 12.5% from last month</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F59E0B]/10">
              <DollarSign className="h-6 w-6 text-[#F59E0B]" />
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
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF5FF]">
              <FileCheck className="h-6 w-6 text-[#2563EB]" />
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#64748B]">Success Rate</p>
              <p className="mt-2 text-2xl font-bold text-[#0F172A]">94.2%</p>
              <p className="mt-1 text-xs text-[#22C55E]">↑ 3.1% improvement</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#22C55E]/10">
              <TrendingUp className="h-6 w-6 text-[#22C55E]" />
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#64748B]">Active Counsellors</p>
              <p className="mt-2 text-2xl font-bold text-[#0F172A]">48</p>
              <p className="mt-1 text-xs text-[#64748B]">Across all regions</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
              <Users className="h-6 w-6 text-[#7C3AED]" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Applications */}
        <Card padding="md">
          <CardHeader>
            <CardTitle>Monthly Applications</CardTitle>
            <p className="text-sm text-[#64748B]">Application trends over the last 6 months</p>
          </CardHeader>
          <CardContent>
            <BarChart data={monthlyApplicationsData} height={250} />
          </CardContent>
        </Card>

        {/* Admission Rate */}
        <Card padding="md">
          <CardHeader>
            <CardTitle>Admission Rate</CardTitle>
            <p className="text-sm text-[#64748B]">Weekly admission success rate</p>
          </CardHeader>
          <CardContent>
            <BarChart data={admissionRateData} height={250} />
          </CardContent>
        </Card>

        {/* Visa Success Rate */}
        <Card padding="md">
          <CardHeader>
            <CardTitle>Visa Success Rate by Country</CardTitle>
            <p className="text-sm text-[#64748B]">Success rates across different destinations</p>
          </CardHeader>
          <CardContent>
            <BarChart data={visaSuccessData} height={250} />
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card padding="md">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <p className="text-sm text-[#64748B]">Monthly revenue in USD</p>
          </CardHeader>
          <CardContent>
            <BarChart data={revenueData} height={250} />
          </CardContent>
        </Card>
      </div>

      {/* Counsellor Performance */}
      <Card padding="md">
        <CardHeader>
          <CardTitle>Counsellor Performance</CardTitle>
          <p className="text-sm text-[#64748B]">Top performing counsellors this month</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Sarah Williams", applications: 45, successRate: 96, revenue: 45000 },
              { name: "Michael Brown", applications: 38, successRate: 94, revenue: 38000 },
              { name: "John Doe", applications: 42, successRate: 92, revenue: 42000 },
              { name: "Emily Davis", applications: 35, successRate: 95, revenue: 35000 },
            ].map((counsellor, idx) => (
              <div key={idx} className="flex items-center gap-4 rounded-xl border border-[#E5E7EB] p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-sm font-bold text-white">
                  {counsellor.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#0F172A]">{counsellor.name}</p>
                  <p className="text-xs text-[#64748B]">{counsellor.applications} applications</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#22C55E]">{counsellor.successRate}%</p>
                  <p className="text-xs text-[#64748B]">Success rate</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#0F172A]">${(counsellor.revenue / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-[#64748B]">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Country Distribution */}
      <Card padding="md">
        <CardHeader>
          <CardTitle>Country Distribution</CardTitle>
          <p className="text-sm text-[#64748B]">Students by destination country</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { country: "Canada", students: 856, percentage: 30, flag: "🇨🇦" },
              { country: "USA", students: 712, percentage: 25, flag: "🇺🇸" },
              { country: "UK", students: 568, percentage: 20, flag: "🇬🇧" },
              { country: "Australia", students: 427, percentage: 15, flag: "🇦🇺" },
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl border border-[#E5E7EB] p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{item.flag}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">{item.country}</p>
                    <p className="text-xs text-[#64748B]">{item.students} students</p>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-[#E2E8F0]">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED]"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <p className="mt-1 text-xs font-semibold text-[#64748B]">{item.percentage}%</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}