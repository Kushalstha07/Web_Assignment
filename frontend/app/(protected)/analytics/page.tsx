"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, FileCheck, TrendingUp, Users } from "lucide-react";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { BarChart } from "@/components/charts/BarChart";
import type { BarChartData } from "@/components/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";
import { getAnalyticsTotals, getMonthlyGrowth, getRegionalDistribution, getSuccessRate, getTopUniversities, type AnalyticsTotals, type MonthlyGrowth, type RegionalDistribution, type SuccessRate, type TopUniversity } from "@/lib/api/analytics.api";

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [totals, setTotals] = useState<AnalyticsTotals | null>(null);
  const [regional, setRegional] = useState<RegionalDistribution[]>([]);
  const [growth, setGrowth] = useState<MonthlyGrowth[]>([]);
  const [top, setTop] = useState<TopUniversity[]>([]);
  const [success, setSuccess] = useState<SuccessRate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { if (!authLoading && !user) router.push("/login"); }, [authLoading, user, router]);
  useEffect(() => {
    if (!user || user.role !== "admin") return;
    void Promise.all([getAnalyticsTotals(), getRegionalDistribution(), getMonthlyGrowth(), getTopUniversities(8), getSuccessRate()])
      .then(([totalsResult, regionalResult, growthResult, topResult, successResult]) => {
        setTotals(totalsResult.data); setRegional(regionalResult.data || []); setGrowth(growthResult.data || []); setTop(topResult.data || []); setSuccess(successResult.data); setError("");
      }).catch((cause) => setError(cause instanceof Error ? cause.message : "Unable to load analytics")).finally(() => setLoading(false));
  }, [user]);

  if (authLoading || loading) return <div className="grid gap-6 md:grid-cols-4">{[1,2,3,4].map((item) => <SkeletonCard key={item}/>)}</div>;
  if (!user) return null;
  const monthlyData: BarChartData[] = growth.map((item) => ({ name: item.month, value: item.count, color: "#2563EB" }));
  const regionalData: BarChartData[] = regional.map((item) => ({ name: item.country?.toUpperCase() || "Unknown", value: item.count, color: "#7C3AED" }));
  const topData: BarChartData[] = top.map((item) => ({ name: item.universityId.slice(-6), value: item.applicationCount, color: "#22C55E" }));

  return <AdminGuard><div className="space-y-6">
    <div><h1 className="text-3xl font-bold text-[#0F172A]">Analytics Dashboard</h1><p className="mt-1 text-sm text-[#64748B]">Live metrics calculated from application data.</p></div>
    {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">{[
      { label: "Total users", value: totals?.totalUsers ?? 0, icon: Users, color: "text-[#2563EB]", bg: "bg-[#EEF5FF]" },
      { label: "Applications", value: totals?.totalApplications ?? 0, icon: FileCheck, color: "text-[#7C3AED]", bg: "bg-purple-100" },
      { label: "Universities", value: totals?.totalUniversities ?? 0, icon: Building2, color: "text-[#F59E0B]", bg: "bg-[#FFF9EE]" },
      { label: "Success rate", value: `${success?.rate ?? 0}%`, icon: TrendingUp, color: "text-[#22C55E]", bg: "bg-[#F0FDF4]" },
    ].map(({ label, value, icon: Icon, color, bg }) => <Card key={label}><div className="flex items-center justify-between"><div><p className="text-sm text-[#64748B]">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div><div className={`rounded-xl p-3 ${bg}`}><Icon className={`h-6 w-6 ${color}`}/></div></div></Card>)}</div>
    <div className="grid gap-6 lg:grid-cols-2"><Chart title="Monthly user growth" subtitle="New accounts by month" data={monthlyData}/><Chart title="Students by destination" subtitle="Regional preference distribution" data={regionalData}/><Chart title="Top universities" subtitle="University IDs ranked by application count" data={topData}/><Card><CardHeader><CardTitle>Application outcomes</CardTitle><p className="text-sm text-[#64748B]">Accepted applications across all records</p></CardHeader><CardContent><div className="flex h-64 flex-col items-center justify-center"><p className="text-5xl font-bold text-[#22C55E]">{success?.rate ?? 0}%</p><p className="mt-3 text-sm text-[#64748B]">{success?.accepted ?? 0} accepted out of {success?.total ?? 0}</p></div></CardContent></Card></div>
  </div></AdminGuard>;
}

function Chart({ title, subtitle, data }: { title: string; subtitle: string; data: BarChartData[] }) {
  return <Card><CardHeader><CardTitle>{title}</CardTitle><p className="text-sm text-[#64748B]">{subtitle}</p></CardHeader><CardContent>{data.length ? <BarChart data={data} height={250}/> : <div className="flex h-64 items-center justify-center text-sm text-[#94A3B8]">No data available yet</div>}</CardContent></Card>;
}
