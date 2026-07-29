"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Download, FileCheck, FileText, Users } from "lucide-react";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";
import { getUsers } from "@/lib/api/admin.api";
import { getAllApplications, type Application } from "@/lib/api/application.api";
import { getAllDocuments, type Document } from "@/lib/api/document.api";
import { getUniversities, type University } from "@/lib/api/university.api";
import type { AdminUser } from "@/lib/api/types";

type Row = Record<string, string | number>;

export default function ReportsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loadedAt, setLoadedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { if (!authLoading && !user) router.push("/login"); }, [authLoading, user, router]);
  useEffect(() => {
    if (!user || user.role !== "admin") return;
    const timer = window.setTimeout(() => {
      void Promise.all([getUsers(1, 100), getAllApplications(1, 100), getAllDocuments(1, 100), getUniversities({ limit: 100 })]).then(([userResult, applicationResult, documentResult, universityResult]) => {
        setUsers(userResult.data || []); setApplications(applicationResult.data || []); setDocuments(documentResult.data || []); setUniversities(universityResult.data || []); setLoadedAt(new Date()); setError("");
      }).catch((cause) => setError(cause instanceof Error ? cause.message : "Unable to prepare reports")).finally(() => setLoading(false));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [user]);

  const reports = useMemo(() => [
    { title: "Users", description: `${users.length} account records currently loaded`, icon: Users, rows: users.map((item) => ({ id: item.id, name: item.fullName, email: item.email, role: item.role, destination: item.destination || "", createdAt: item.createdAt })) },
    { title: "Applications", description: `${applications.length} application records currently loaded`, icon: FileText, rows: applications.map((item) => ({ id: item.id, studentId: item.studentId, universityId: item.universityId, program: item.program, status: item.status, stage: item.stage, updatedAt: item.updatedAt })) },
    { title: "Documents", description: `${documents.length} uploaded document records currently loaded`, icon: FileCheck, rows: documents.map((item) => ({ id: item.id, userId: item.userId, filename: item.originalName, category: item.category, status: item.status, createdAt: item.createdAt })) },
    { title: "Universities", description: `${universities.length} university records currently loaded`, icon: Building2, rows: universities.map((item) => ({ id: item.id, name: item.name, country: item.country, city: item.city, ranking: item.ranking, tuitionFee: item.tuitionFee, active: String(item.isActive) })) },
  ], [users, applications, documents, universities]);

  if (authLoading) return <div className="grid gap-4 md:grid-cols-2">{[1,2,3,4].map((item) => <SkeletonCard key={item}/>)}</div>;
  if (!user) return null;
  if (user.role !== "admin") return <AdminGuard><div /></AdminGuard>;
  if (loading) return <div className="grid gap-4 md:grid-cols-2">{[1,2,3,4].map((item) => <SkeletonCard key={item}/>)}</div>;

  return <AdminGuard><div className="space-y-6">
    <div><h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Reports</h1><p className="mt-1 text-sm text-[#64748B]">Download CSV exports generated from the current API records{loadedAt ? ` · refreshed ${loadedAt.toLocaleString()}` : ""}.</p></div>
    {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    <div className="grid gap-4 md:grid-cols-2">{reports.map((report) => { const Icon = report.icon; return <Card key={report.title} className="flex flex-col"><div className="flex items-start gap-4"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#EEF5FF]"><Icon className="h-6 w-6 text-[#2563EB]"/></div><div><h2 className="font-bold text-[#0F172A]">{report.title} report</h2><p className="mt-1 text-sm text-[#64748B]">{report.description}</p></div></div><div className="mt-6 border-t pt-4"><Button variant="secondary" className="w-full" disabled={!report.rows.length} onClick={() => downloadCsv(report.title.toLowerCase(), report.rows)}><Download className="h-4 w-4"/>{report.rows.length ? `Download ${report.rows.length} rows` : "No records to export"}</Button></div></Card>; })}</div>
  </div></AdminGuard>;
}

function downloadCsv(name: string, rows: Row[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (value: string | number) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const csv = [headers.map(escape).join(","), ...rows.map((row) => headers.map((header) => escape(row[header])).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${name}-${new Date().toISOString().slice(0, 10)}.csv`; anchor.click(); URL.revokeObjectURL(url);
}
