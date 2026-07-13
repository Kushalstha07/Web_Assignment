"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Search, CheckCircle, Clock3, Send, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { getAllApplications, getAssignedApplications, getMyApplications, updateApplication, type Application } from "@/lib/api/application.api";
import { getUsers } from "@/lib/api/admin.api";
import type { AdminUser } from "@/lib/api/types";
import { getUniversities, type University } from "@/lib/api/university.api";
import { getCounsellors, type Counsellor } from "@/lib/api/counsellor.api";

const statuses = ["draft", "submitted", "under-review", "accepted", "rejected", "waitlisted", "withdrawn"];
const stages = ["documents-pending", "documents-uploaded", "verified", "interview-scheduled", "interview-completed", "decision-pending", "decision-made"];
const pretty = (value: string) => value.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ");

function statusVariant(status: string): "default" | "info" | "success" | "warning" | "danger" {
  if (status === "accepted") return "success";
  if (status === "rejected" || status === "withdrawn") return "danger";
  if (status === "submitted" || status === "under-review" || status === "waitlisted") return "warning";
  return "default";
}

export default function ApplicationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { if (!authLoading && !user) router.push("/login"); }, [authLoading, user, router]);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const applicationRequest = user.role === "admin"
        ? getAllApplications(1, 100)
        : user.role === "counsellor"
          ? getAssignedApplications()
          : getMyApplications();
      const [applicationResult, universityResult, userResult, counsellorResult] = await Promise.all([
        applicationRequest,
        getUniversities({ limit: 100 }),
        user.role === "admin" ? getUsers(1, 100) : Promise.resolve(null),
        user.role === "admin" ? getCounsellors() : Promise.resolve(null),
      ]);
      setApplications(applicationResult.data || []);
      setUniversities(universityResult.data || []);
      setUsers(userResult?.data || []);
      setCounsellors(counsellorResult?.data || []);
      setError("");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to load applications"); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);

  const userNames = useMemo(() => new Map(users.map((item) => [item.id, item.fullName])), [users]);
  const universityNames = useMemo(() => new Map(universities.map((item) => [item.id, item.name])), [universities]);
  const counsellorNames = useMemo(() => new Map(counsellors.map((item) => [item.id, item.fullName])), [counsellors]);
  const filtered = useMemo(() => applications.filter((item) => {
    const haystack = `${item.program} ${userNames.get(item.studentId) || item.studentId} ${universityNames.get(item.universityId) || item.universityId}`.toLowerCase();
    return haystack.includes(search.toLowerCase()) && (!status || item.status === status);
  }), [applications, search, status, userNames, universityNames]);

  async function changeApplication(id: string, field: "status" | "stage", value: string) {
    try {
      setSavingId(id);
      const response = await updateApplication(id, { [field]: value });
      if (!response.success) throw new Error(response.message);
      setApplications((current) => current.map((item) => item.id === id ? response.data : item));
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to update application"); }
    finally { setSavingId(""); }
  }

  async function assignCounsellor(id: string, counsellorId: string) {
    try {
      setSavingId(id);
      const response = await updateApplication(id, { counsellorId: counsellorId || null });
      if (!response.success) throw new Error(response.message);
      setApplications((current) => current.map((item) => item.id === id ? response.data : item));
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to assign counsellor"); }
    finally { setSavingId(""); }
  }

  if (authLoading || loading) return <div className="space-y-6"><SkeletonTable rows={7} columns={7}/></div>;
  if (!user) return null;

  const counts = {
    total: applications.length,
    submitted: applications.filter((item) => item.status === "submitted" || item.status === "under-review").length,
    accepted: applications.filter((item) => item.status === "accepted").length,
    rejected: applications.filter((item) => item.status === "rejected").length,
  };

  return <div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Applications</h1><p className="mt-1 text-sm text-[#64748B]">Live application records from the application service.</p></div>{user.role === "student" && <Button onClick={() => router.push("/universities")}>Start application</Button>}</div>
    {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Metric label="Total" value={counts.total} icon={FileText} color="text-[#2563EB]" bg="bg-[#EEF5FF]"/>
      <Metric label="In review" value={counts.submitted} icon={Clock3} color="text-[#F59E0B]" bg="bg-[#FFF9EE]"/>
      <Metric label="Accepted" value={counts.accepted} icon={CheckCircle} color="text-[#22C55E]" bg="bg-[#F0FDF4]"/>
      <Metric label="Rejected" value={counts.rejected} icon={XCircle} color="text-[#EF4444]" bg="bg-red-50"/>
    </div>
    <Card><div className="flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"/><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search student, university, or program" className="pl-10"/></div><select value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 rounded-xl border border-[#DDE5EF] bg-white px-4 text-sm"><option value="">All statuses</option>{statuses.map((item) => <option key={item} value={item}>{pretty(item)}</option>)}</select></div></Card>
    <div className="overflow-x-auto rounded-[20px] border border-[#E7EDF6] bg-white shadow-sm"><table className="min-w-[1180px] w-full"><thead><tr className="border-b bg-[#F8FAFC]">{["Student", "University", "Program", "Counsellor", "Status", "Stage", "Updated", "Actions"].map((heading) => <th key={heading} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#64748B]">{heading}</th>)}</tr></thead><tbody className="divide-y divide-[#E7EDF6]">
      {filtered.map((item) => <tr key={item.id} className="hover:bg-[#F8FAFC]"><td className="px-5 py-4"><p className="text-sm font-semibold text-[#0F172A]">{item.studentName || userNames.get(item.studentId) || (item.studentId === user.id ? user.fullName : "Unknown user")}</p><p className="text-xs text-[#94A3B8]">{item.studentId.slice(-8)}</p></td><td className="px-5 py-4 text-sm text-[#0F172A]">{universityNames.get(item.universityId) || "Unknown university"}</td><td className="px-5 py-4 text-sm text-[#64748B]">{item.program}</td><td className="px-5 py-4">{user.role === "admin" ? <select disabled={savingId === item.id} value={item.counsellorId || ""} onChange={(event) => void assignCounsellor(item.id, event.target.value)} className="h-9 max-w-44 rounded-lg border px-2 text-xs"><option value="">Unassigned</option>{counsellors.map((counsellor) => <option key={counsellor.id} value={counsellor.id}>{counsellor.fullName}</option>)}</select> : <span className="text-sm text-[#64748B]">{item.counsellorId ? counsellorNames.get(item.counsellorId) || "Assigned to you" : "Unassigned"}</span>}</td><td className="px-5 py-4">{user.role === "admin" || user.role === "counsellor" ? <select disabled={savingId === item.id} value={item.status} onChange={(event) => void changeApplication(item.id, "status", event.target.value)} className="h-9 rounded-lg border px-2 text-xs">{statuses.map((value) => <option key={value} value={value}>{pretty(value)}</option>)}</select> : <Badge variant={statusVariant(item.status)}>{pretty(item.status)}</Badge>}</td><td className="px-5 py-4">{user.role === "admin" || user.role === "counsellor" ? <select disabled={savingId === item.id} value={item.stage} onChange={(event) => void changeApplication(item.id, "stage", event.target.value)} className="h-9 rounded-lg border px-2 text-xs">{stages.map((value) => <option key={value} value={value}>{pretty(value)}</option>)}</select> : <span className="text-sm text-[#64748B]">{pretty(item.stage)}</span>}</td><td className="px-5 py-4 text-sm text-[#64748B]">{new Date(item.updatedAt).toLocaleDateString()}</td><td className="px-5 py-4"><Button variant="ghost" size="sm" onClick={() => router.push(`/applications?selected=${item.id}`)}><Send className="h-4 w-4"/>Details</Button></td></tr>)}
      {filtered.length === 0 && <tr><td colSpan={8} className="px-6 py-16 text-center text-sm text-[#64748B]">No application records match this view.</td></tr>}
    </tbody></table></div>
  </div>;
}

function Metric({ label, value, icon: Icon, color, bg }: { label: string; value: number; icon: React.ElementType; color: string; bg: string }) {
  return <Card><div className="flex items-center justify-between"><div><p className="text-sm text-[#64748B]">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div><div className={`rounded-xl p-3 ${bg}`}><Icon className={`h-5 w-5 ${color}`}/></div></div></Card>;
}
