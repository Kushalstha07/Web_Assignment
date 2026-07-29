"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Award, CalendarDays, ExternalLink, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { getScholarships, type Scholarship } from "@/lib/api/scholarship.api";

const types = ["merit-based", "need-based", "country-specific", "university-specific", "government", "private"];
const countries = ["usa", "uk", "canada", "australia", "europe"];
const pretty = (value: string) => value.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");

export default function ScholarshipsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Scholarship[]>([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { if (!authLoading && !user) router.push("/login"); }, [authLoading, user, router]);
  const load = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getScholarships({ search: search || undefined, type: type || undefined, country: country || undefined, status: status || undefined, limit: 50 });
      if (!response.success) throw new Error(response.message);
      setItems(response.data || []); setError("");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to load scholarships"); }
    finally { setLoading(false); }
  }, [search, type, country, status]);
  useEffect(() => { if (!user) return; const timer = window.setTimeout(() => void load(), 250); return () => window.clearTimeout(timer); }, [user, load]);

  if (authLoading) return <SkeletonCard/>;
  if (!user) return null;
  const totalValue = items.reduce((sum, item) => sum + item.amount, 0);

  return <div className="space-y-6">
    <div><h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Scholarships</h1><p className="mt-1 text-sm text-[#64748B]">Search current opportunities from the scholarship API.</p></div>
    <div className="grid gap-4 md:grid-cols-3"><Card><p className="text-sm text-[#64748B]">Results</p><p className="mt-1 text-2xl font-bold">{items.length}</p></Card><Card><p className="text-sm text-[#64748B]">Active</p><p className="mt-1 text-2xl font-bold text-[#22C55E]">{items.filter((item) => item.status === "active").length}</p></Card><Card><p className="text-sm text-[#64748B]">Combined value</p><p className="mt-1 text-2xl font-bold text-[#2563EB]">${totalValue.toLocaleString()}</p></Card></div>
    <Card><div className="grid gap-3 md:grid-cols-4"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"/><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search scholarships" className="pl-10"/></div><select value={type} onChange={(event) => setType(event.target.value)} className="rounded-xl border px-3 text-sm"><option value="">All types</option>{types.map((item) => <option key={item} value={item}>{pretty(item)}</option>)}</select><select value={country} onChange={(event) => setCountry(event.target.value)} className="rounded-xl border px-3 text-sm"><option value="">All countries</option>{countries.map((item) => <option key={item} value={item}>{item.toUpperCase()}</option>)}</select><select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border px-3 text-sm"><option value="">All statuses</option><option value="active">Active</option><option value="upcoming">Upcoming</option><option value="expired">Expired</option></select></div></Card>
    {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    {loading ? <div className="grid gap-6 md:grid-cols-3">{[1,2,3].map((item) => <SkeletonCard key={item}/>)}</div> : <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{items.map((item) => <Card key={item.id} className="flex flex-col">
      <div className="flex items-start justify-between gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF5FF]"><Award className="h-5 w-5 text-[#2563EB]"/></div><Badge variant={item.status === "active" ? "success" : item.status === "upcoming" ? "info" : "default"}>{pretty(item.status)}</Badge></div><h2 className="mt-4 font-bold text-[#0F172A]">{item.name}</h2><p className="text-sm text-[#64748B]">{item.provider}</p><p className="mt-3 text-2xl font-bold text-[#22C55E]">{item.currency} {item.amount.toLocaleString()}</p><p className="mt-2 line-clamp-3 text-sm text-[#64748B]">{item.description || item.eligibility}</p>
      <div className="mt-4 flex flex-wrap gap-2">{item.countries.map((value) => <span key={value} className="rounded-full bg-[#F8FAFC] px-2 py-1 text-xs">{value.toUpperCase()}</span>)}<span className="rounded-full bg-purple-50 px-2 py-1 text-xs text-[#7C3AED]">{pretty(item.type)}</span></div>
      <div className="mt-auto flex items-center justify-between border-t pt-4"><span className="flex items-center gap-1 text-xs text-[#64748B]"><CalendarDays className="h-4 w-4"/>{item.deadline ? new Date(item.deadline).toLocaleDateString() : "Open deadline"}</span>{item.applicationUrl && <Button size="sm" onClick={() => window.open(item.applicationUrl, "_blank", "noopener,noreferrer")}>Apply <ExternalLink className="h-4 w-4"/></Button>}</div>
    </Card>)}</div>}
    {!loading && items.length === 0 && <Card><p className="text-center text-sm text-[#64748B]">No scholarships match these filters.</p></Card>}
  </div>;
}
