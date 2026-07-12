"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Clock, ExternalLink, FileCheck, Search, XCircle } from "lucide-react";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { getAllDocuments, verifyDocument, type Document } from "@/lib/api/document.api";
import { getUsers } from "@/lib/api/admin.api";
import type { AdminUser } from "@/lib/api/types";

const pretty = (value: string) => value.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ");

export default function VerificationPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { if (!authLoading && !user) router.push("/login"); }, [authLoading, user, router]);
  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [documentResult, userResult] = await Promise.all([getAllDocuments(1, 100), getUsers(1, 100)]);
      if (!documentResult.success) throw new Error(documentResult.message);
      setDocuments(documentResult.data || []); setUsers(userResult.data || []); setError("");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to load documents"); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);

  const names = useMemo(() => new Map(users.map((item) => [item.id, item.fullName])), [users]);
  const filtered = useMemo(() => documents.filter((item) => {
    const haystack = `${names.get(item.userId) || item.userId} ${item.originalName} ${item.category}`.toLowerCase();
    return haystack.includes(search.toLowerCase()) && (!status || item.status === status);
  }), [documents, names, search, status]);

  async function review(id: string, nextStatus: "verified" | "rejected") {
    try {
      setSavingId(id);
      const response = await verifyDocument(id, nextStatus);
      if (!response.success) throw new Error(response.message);
      setDocuments((current) => current.map((item) => item.id === id ? response.data : item));
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to review document"); }
    finally { setSavingId(""); }
  }

  if (authLoading || loading) return <SkeletonTable rows={7} columns={6}/>;
  if (!user) return null;
  const counts = { total: documents.length, verified: documents.filter((item) => item.status === "verified").length, pending: documents.filter((item) => item.status === "pending").length, rejected: documents.filter((item) => item.status === "rejected").length };

  return <AdminGuard><div className="space-y-6">
    <div><h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Document Verification</h1><p className="mt-1 text-sm text-[#64748B]">Live uploads awaiting administrative review.</p></div>
    {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Total" value={counts.total} icon={FileCheck} color="text-[#2563EB]" bg="bg-[#EEF5FF]"/><Metric label="Verified" value={counts.verified} icon={CheckCircle} color="text-[#22C55E]" bg="bg-[#F0FDF4]"/><Metric label="Pending" value={counts.pending} icon={Clock} color="text-[#F59E0B]" bg="bg-[#FFF9EE]"/><Metric label="Rejected" value={counts.rejected} icon={XCircle} color="text-[#EF4444]" bg="bg-red-50"/></div>
    <Card><div className="flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"/><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search student, filename, or category" className="pl-10"/></div><select value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 rounded-xl border border-[#DDE5EF] px-4 text-sm"><option value="">All statuses</option><option value="pending">Pending</option><option value="verified">Verified</option><option value="rejected">Rejected</option><option value="expired">Expired</option></select></div></Card>
    <div className="overflow-x-auto rounded-[20px] border border-[#E7EDF6] bg-white shadow-sm"><table className="min-w-[860px] w-full"><thead><tr className="border-b bg-[#F8FAFC]">{["Student", "Document", "Category", "Uploaded", "Size", "Status", "Actions"].map((heading) => <th key={heading} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#64748B]">{heading}</th>)}</tr></thead><tbody className="divide-y divide-[#E7EDF6]">
      {filtered.map((item) => <tr key={item.id} className="hover:bg-[#F8FAFC]"><td className="px-5 py-4 text-sm font-semibold text-[#0F172A]">{names.get(item.userId) || "Unknown user"}</td><td className="px-5 py-4"><p className="max-w-56 truncate text-sm text-[#0F172A]">{item.originalName}</p><p className="text-xs text-[#94A3B8]">{item.mimeType}</p></td><td className="px-5 py-4 text-sm text-[#64748B]">{pretty(item.category)}</td><td className="px-5 py-4 text-sm text-[#64748B]">{new Date(item.createdAt).toLocaleDateString()}</td><td className="px-5 py-4 text-sm text-[#64748B]">{formatSize(item.size)}</td><td className="px-5 py-4"><Badge variant={item.status === "verified" ? "success" : item.status === "rejected" ? "danger" : item.status === "pending" ? "warning" : "default"}>{pretty(item.status)}</Badge></td><td className="px-5 py-4"><div className="flex gap-1"><Button variant="ghost" size="sm" onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}><ExternalLink className="h-4 w-4"/>View</Button>{item.status === "pending" && <><Button disabled={savingId === item.id} variant="ghost" size="sm" className="text-[#16A34A]" onClick={() => void review(item.id, "verified")}>Approve</Button><Button disabled={savingId === item.id} variant="ghost" size="sm" className="text-[#DC2626]" onClick={() => void review(item.id, "rejected")}>Reject</Button></>}</div></td></tr>)}
      {filtered.length === 0 && <tr><td colSpan={7} className="px-6 py-16 text-center text-sm text-[#64748B]">No uploaded documents match this view.</td></tr>}
    </tbody></table></div>
  </div></AdminGuard>;
}

function formatSize(bytes: number) { if (bytes < 1024) return `${bytes} B`; if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`; return `${(bytes / (1024 * 1024)).toFixed(1)} MB`; }
function Metric({ label, value, icon: Icon, color, bg }: { label: string; value: number; icon: React.ElementType; color: string; bg: string }) { return <Card><div className="flex items-center justify-between"><div><p className="text-sm text-[#64748B]">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div><div className={`rounded-xl p-3 ${bg}`}><Icon className={`h-5 w-5 ${color}`}/></div></div></Card>; }
