"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { StudentPipeline, type Student } from "@/components/admin/StudentPipeline";
import { Card } from "@/components/ui/Card";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";
import { getUsers } from "@/lib/api/admin.api";
import { getAllApplications, updateApplication, type Application } from "@/lib/api/application.api";
import type { AdminUser } from "@/lib/api/types";
import { getUniversities, type University } from "@/lib/api/university.api";

export default function PipelinePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { if (!authLoading && !user) router.push("/login"); }, [authLoading, user, router]);
  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [applicationResult, userResult, universityResult] = await Promise.all([getAllApplications(1, 100), getUsers(1, 100), getUniversities({ limit: 100 })]);
      setApplications(applicationResult.data || []); setUsers(userResult.data || []); setUniversities(universityResult.data || []); setError("");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to load pipeline"); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);

  const pipelineStudents = useMemo<Student[]>(() => {
    const userMap = new Map(users.map((item) => [item.id, item]));
    const universityMap = new Map(universities.map((item) => [item.id, item.name]));
    return applications.map((application) => {
      const student = userMap.get(application.studentId);
      return { id: application.id, name: student?.fullName || "Unknown user", email: student?.email || "No email available", phone: student?.phoneNumber, university: universityMap.get(application.universityId) || "Unknown university", program: application.program, stage: application.stage };
    });
  }, [applications, users, universities]);

  async function moveApplication(id: string, stage: string) {
    try {
      const response = await updateApplication(id, { stage });
      if (!response.success) throw new Error(response.message);
      setApplications((current) => current.map((item) => item.id === id ? response.data : item));
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to update application stage"); await load(); }
  }

  if (authLoading || loading) return <SkeletonCard/>;
  if (!user) return null;
  const active = applications.filter((item) => item.status !== "accepted" && item.status !== "rejected" && item.status !== "withdrawn").length;
  const decisions = applications.filter((item) => item.stage === "decision-made").length;

  return <AdminGuard><div className="space-y-6">
    <div><h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Application Pipeline</h1><p className="mt-1 text-sm text-[#64748B]">Every card and stage comes directly from application records.</p></div>
    {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    <div className="grid gap-4 sm:grid-cols-3"><Metric label="Applications" value={applications.length}/><Metric label="Active cases" value={active}/><Metric label="Decisions made" value={decisions}/></div>
    {pipelineStudents.length ? <StudentPipeline students={pipelineStudents} onStageChange={moveApplication}/> : <Card className="flex min-h-72 items-center justify-center"><p className="text-sm text-[#64748B]">No application records are available for the pipeline.</p></Card>}
  </div></AdminGuard>;
}

function Metric({ label, value }: { label: string; value: number }) { return <Card><p className="text-sm text-[#64748B]">{label}</p><p className="mt-2 text-2xl font-bold text-[#0F172A]">{value}</p></Card>; }
