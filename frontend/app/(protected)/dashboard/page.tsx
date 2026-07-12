"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Award, Building2, Calendar, CheckCircle, FileCheck, FileText, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { BarChart } from "@/components/charts/BarChart";
import type { BarChartData } from "@/components/charts";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { SkeletonCard, SkeletonTable } from "@/components/ui/Skeleton";
import { getUsers } from "@/lib/api/admin.api";
import { getAnalyticsTotals, getMonthlyGrowth, getSuccessRate, type AnalyticsTotals, type MonthlyGrowth, type SuccessRate } from "@/lib/api/analytics.api";
import { getAllApplications, getMyApplications, type Application } from "@/lib/api/application.api";
import { getMyAppointments, type Appointment } from "@/lib/api/appointment.api";
import { getMyDocuments, type Document } from "@/lib/api/document.api";
import { getScholarships, type Scholarship } from "@/lib/api/scholarship.api";
import type { AdminUser } from "@/lib/api/types";
import { getUniversities, type University } from "@/lib/api/university.api";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && !user) router.push("/login"); }, [loading, user, router]);
  if (loading) return <div className="space-y-6"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[1,2,3,4].map((item) => <SkeletonCard key={item}/>)}</div><SkeletonTable/></div>;
  if (!user) return null;
  return user.role === "admin" ? <AdminDashboard/> : <StudentDashboard/>;
}

function AdminDashboard() {
  const [totals, setTotals] = useState<AnalyticsTotals | null>(null);
  const [growth, setGrowth] = useState<MonthlyGrowth[]>([]);
  const [success, setSuccess] = useState<SuccessRate | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void Promise.all([getAnalyticsTotals(), getMonthlyGrowth(), getSuccessRate(), getUsers(1, 8), getAllApplications(1, 8), getUniversities({ limit: 100 })]).then(([totalResult, growthResult, successResult, userResult, applicationResult, universityResult]) => {
        setTotals(totalResult.data); setGrowth(growthResult.data || []); setSuccess(successResult.data); setUsers(userResult.data || []); setApplications(applicationResult.data || []); setUniversities(universityResult.data || []); setError("");
      }).catch((cause) => setError(cause instanceof Error ? cause.message : "Unable to load dashboard")).finally(() => setLoading(false));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const universityNames = useMemo(() => new Map(universities.map((item) => [item.id, item.name])), [universities]);
  if (loading) return <div className="space-y-6"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[1,2,3,4].map((item) => <SkeletonCard key={item}/>)}</div><SkeletonTable/></div>;
  const chartData: BarChartData[] = growth.map((item) => ({ name: item.month, value: item.count, color: "#2563EB" }));

  return <div className="space-y-6">
    <div><h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Dashboard Overview</h1><p className="mt-1 text-sm text-[#64748B]">Current system totals and recent records.</p></div>
    {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric title="Users" value={totals?.totalUsers ?? 0} detail={`${totals?.totalStudents ?? 0} students`} icon={Users} color="text-[#2563EB]" bg="bg-[#EEF5FF]"/><Metric title="Applications" value={totals?.totalApplications ?? 0} detail={`${success?.rate ?? 0}% acceptance rate`} icon={FileText} color="text-[#7C3AED]" bg="bg-purple-50"/><Metric title="Universities" value={totals?.totalUniversities ?? 0} detail={`${universities.filter((item) => item.isActive).length} active loaded`} icon={Building2} color="text-[#F59E0B]" bg="bg-[#FFF9EE]"/><Metric title="Documents" value={totals?.totalDocuments ?? 0} detail="Uploaded records" icon={FileCheck} color="text-[#22C55E]" bg="bg-[#F0FDF4]"/></div>
    <div className="grid gap-4 xl:grid-cols-5">
      <Card className="xl:col-span-3"><CardHeader><CardTitle>Monthly account growth</CardTitle><p className="text-sm text-[#64748B]">Aggregated directly from user creation dates</p></CardHeader><CardContent>{chartData.length ? <BarChart data={chartData} height={260}/> : <Empty text="No user growth records yet."/>}</CardContent></Card>
      <Card className="xl:col-span-2"><div className="mb-4 flex items-center justify-between"><h2 className="font-bold">Recent users</h2><Link href="/admin/users" className="text-sm font-semibold text-[#2563EB]">View all</Link></div><div className="space-y-2">{users.map((item) => <div key={item.id} className="flex items-center justify-between rounded-xl border border-[#E7EDF6] p-3"><div className="min-w-0"><p className="truncate text-sm font-semibold">{item.fullName}</p><p className="truncate text-xs text-[#64748B]">{item.email}</p></div><Badge variant={item.role === "admin" ? "purple" : item.role === "counsellor" ? "success" : "info"}>{item.role}</Badge></div>)}{!users.length && <Empty text="No users available."/>}</div></Card>
    </div>
    <Card><div className="mb-4 flex items-center justify-between"><h2 className="font-bold">Recent applications</h2><Link href="/applications" className="text-sm font-semibold text-[#2563EB]">Manage applications</Link></div><div className="overflow-x-auto"><table className="min-w-[720px] w-full"><thead><tr className="border-b text-left text-xs uppercase tracking-wider text-[#64748B]"><th className="py-3">University</th><th>Program</th><th>Status</th><th>Stage</th><th>Updated</th></tr></thead><tbody className="divide-y">{applications.map((item) => <tr key={item.id}><td className="py-3 text-sm font-semibold">{universityNames.get(item.universityId) || "Unknown university"}</td><td className="text-sm text-[#64748B]">{item.program}</td><td><Badge variant={item.status === "accepted" ? "success" : item.status === "rejected" ? "danger" : "warning"}>{item.status}</Badge></td><td className="text-sm text-[#64748B]">{item.stage}</td><td className="text-sm text-[#64748B]">{new Date(item.updatedAt).toLocaleDateString()}</td></tr>)}</tbody></table>{!applications.length && <Empty text="No applications available."/>}</div></Card>
  </div>;
}

function StudentDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void Promise.all([getMyApplications(), getUniversities({ limit: 100 }), getScholarships({ status: "active", limit: 10 }), getMyDocuments(), getMyAppointments()]).then(([applicationResult, universityResult, scholarshipResult, documentResult, appointmentResult]) => {
        setApplications(applicationResult.data || []); setUniversities(universityResult.data || []); setScholarships(scholarshipResult.data || []); setDocuments(documentResult.data || []); setAppointments(appointmentResult.data || []);
      }).finally(() => setLoading(false));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const universityNames = useMemo(() => new Map(universities.map((item) => [item.id, item.name])), [universities]);
  if (loading) return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[1,2,3,4].map((item) => <SkeletonCard key={item}/>)}</div>;
  const upcomingAppointments = appointments.filter((item) => item.status !== "cancelled" && new Date(`${item.date.slice(0,10)}T${item.startTime}:00`) >= new Date());

  return <div className="space-y-6">
    <div><h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Welcome back, {user?.fullName?.split(" ")[0]}</h1><p className="mt-1 text-sm text-[#64748B]">Your current applications, documents, appointments, and opportunities.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric title="Applications" value={applications.length} detail="Your records" icon={FileText} color="text-[#2563EB]" bg="bg-[#EEF5FF]"/><Metric title="Verified documents" value={documents.filter((item) => item.status === "verified").length} detail={`${documents.length} total uploads`} icon={CheckCircle} color="text-[#22C55E]" bg="bg-[#F0FDF4]"/><Metric title="Upcoming meetings" value={upcomingAppointments.length} detail="Scheduled appointments" icon={Calendar} color="text-[#F59E0B]" bg="bg-[#FFF9EE]"/><Metric title="Scholarships" value={scholarships.length} detail="Active opportunities loaded" icon={Award} color="text-[#7C3AED]" bg="bg-purple-50"/></div>
    <div className="grid gap-4 xl:grid-cols-3"><Card className="xl:col-span-2"><div className="mb-4 flex items-center justify-between"><h2 className="font-bold">My applications</h2><Link href="/applications" className="text-sm font-semibold text-[#2563EB]">View all</Link></div><div className="space-y-3">{applications.slice(0,5).map((item) => <div key={item.id} className="flex flex-col gap-3 rounded-xl border border-[#E7EDF6] p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">{universityNames.get(item.universityId) || "Unknown university"}</p><p className="text-sm text-[#64748B]">{item.program} · {item.stage}</p></div><Badge variant={item.status === "accepted" ? "success" : item.status === "rejected" ? "danger" : "warning"}>{item.status}</Badge></div>)}{!applications.length && <Empty text="You have no applications yet."/>}</div></Card><Card><h2 className="mb-4 font-bold">Scholarship deadlines</h2><div className="space-y-3">{scholarships.slice(0,5).map((item) => <div key={item.id} className="border-b pb-3 last:border-0"><p className="text-sm font-semibold">{item.name}</p><p className="mt-1 text-xs text-[#64748B]">{item.deadline ? new Date(item.deadline).toLocaleDateString() : "No deadline provided"}</p></div>)}{!scholarships.length && <Empty text="No active scholarships available."/>}</div></Card></div>
  </div>;
}

function Metric({ title, value, detail, icon: Icon, color, bg }: { title: string; value: number; detail: string; icon: React.ElementType; color: string; bg: string }) { return <Card><div className="flex items-center justify-between"><div><p className="text-sm text-[#64748B]">{title}</p><p className="mt-2 text-2xl font-bold">{value}</p><p className="mt-1 text-xs text-[#94A3B8]">{detail}</p></div><div className={`rounded-xl p-3 ${bg}`}><Icon className={`h-6 w-6 ${color}`}/></div></div></Card>; }
function Empty({ text }: { text: string }) { return <div className="flex min-h-24 items-center justify-center text-center text-sm text-[#94A3B8]">{text}</div>; }
