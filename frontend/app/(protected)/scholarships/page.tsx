"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Award, CalendarDays, ExternalLink, Pencil, Plus, Save, Search, Sparkles, Trash2, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Textarea } from "@/components/ui/Textarea";
import { getScholarshipAdvice } from "@/lib/api/ai.api";
import { createScholarship, deleteScholarship, getScholarships, updateScholarship, type Scholarship } from "@/lib/api/scholarship.api";

const types = ["merit-based", "need-based", "country-specific", "university-specific", "government", "private"];
const countries = ["usa", "uk", "canada", "australia", "europe"];
const pretty = (value: string) => value.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
const emptyForm = {
  name: "",
  provider: "",
  type: "merit-based",
  amount: "",
  currency: "USD",
  description: "",
  eligibility: "",
  requirements: "",
  countries: "",
  universities: "",
  deadline: "",
  status: "active",
  applicationUrl: "",
  imageUrl: "",
};
type ScholarshipForm = typeof emptyForm;
const toDateInputValue = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value.slice(0, 10) : date.toISOString().slice(0, 10);
};
const listFromText = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean);
const formFromScholarship = (item: Scholarship): ScholarshipForm => ({
  name: item.name,
  provider: item.provider,
  type: item.type,
  amount: String(item.amount),
  currency: item.currency || "USD",
  description: item.description || "",
  eligibility: item.eligibility || "",
  requirements: item.requirements.join(", "),
  countries: item.countries.join(", "),
  universities: item.universities.join(", "),
  deadline: toDateInputValue(item.deadline),
  status: item.status,
  applicationUrl: item.applicationUrl || "",
  imageUrl: item.imageUrl || "",
});
const payloadFromForm = (form: ScholarshipForm) => ({
  name: form.name.trim(),
  provider: form.provider.trim(),
  type: form.type,
  amount: Number(form.amount),
  currency: form.currency.trim() || "USD",
  description: form.description.trim(),
  eligibility: form.eligibility.trim(),
  requirements: listFromText(form.requirements),
  countries: listFromText(form.countries),
  universities: listFromText(form.universities),
  deadline: form.deadline || undefined,
  status: form.status,
  applicationUrl: form.applicationUrl.trim() || undefined,
  imageUrl: form.imageUrl.trim() || undefined,
});

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
  const [adminMessage, setAdminMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ScholarshipForm>(emptyForm);
  const [aiAdvice, setAiAdvice] = useState("");
  const [aiError, setAiError] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

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
  const isAdmin = user.role === "admin";
  const canApply = user.role === "student";
  const totalValue = items.reduce((sum, item) => sum + item.amount, 0);
  const resetForm = () => { setForm(emptyForm); setEditingId(null); setFormOpen(false); setFormError(""); };
  const startCreate = () => { setAdminMessage(""); setFormError(""); setEditingId(null); setForm(emptyForm); setFormOpen(true); };
  const startEdit = (item: Scholarship) => { setAdminMessage(""); setFormError(""); setEditingId(item.id); setForm(formFromScholarship(item)); setFormOpen(true); };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setAdminMessage("");
    if (!form.name.trim() || !form.provider.trim()) {
      setFormError("Name and provider are required.");
      return;
    }
    if (!form.amount || Number.isNaN(Number(form.amount)) || Number(form.amount) < 0) {
      setFormError("Amount must be a valid positive number.");
      return;
    }
    try {
      setSaving(true);
      const payload = payloadFromForm(form);
      const response = editingId ? await updateScholarship(editingId, payload) : await createScholarship(payload);
      if (!response.success) throw new Error(response.message);
      setAdminMessage(editingId ? "Scholarship updated." : "Scholarship added.");
      resetForm();
      await load();
    } catch (cause) {
      setFormError(cause instanceof Error ? cause.message : "Unable to save scholarship.");
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (item: Scholarship) => {
    if (!window.confirm(`Delete ${item.name}?`)) return;
    try {
      setAdminMessage("");
      await deleteScholarship(item.id);
      setAdminMessage("Scholarship deleted.");
      if (editingId === item.id) resetForm();
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to delete scholarship.");
    }
  };
  const updateField = (field: keyof ScholarshipForm, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const handleAiAdvice = async () => {
    try {
      setAiLoading(true);
      setAiError("");
      const response = await getScholarshipAdvice();
      if (!response.success) throw new Error(response.message);
      setAiAdvice(response.data.advice);
    } catch (cause) {
      setAiError(cause instanceof Error ? cause.message : "Unable to generate scholarship advice.");
    } finally {
      setAiLoading(false);
    }
  };

  return <div className="space-y-6">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div><h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Scholarships</h1><p className="mt-1 text-sm text-[#64748B]">Search current opportunities from the scholarship API.</p></div>
      {isAdmin && <Button onClick={startCreate}><Plus className="h-4 w-4"/>Add scholarship</Button>}
    </div>
    <div className="grid gap-4 md:grid-cols-3"><Card><p className="text-sm text-[#64748B]">Results</p><p className="mt-1 text-2xl font-bold">{items.length}</p></Card><Card><p className="text-sm text-[#64748B]">Active</p><p className="mt-1 text-2xl font-bold text-[#22C55E]">{items.filter((item) => item.status === "active").length}</p></Card><Card><p className="text-sm text-[#64748B]">Combined value</p><p className="mt-1 text-2xl font-bold text-[#2563EB]">${totalValue.toLocaleString()}</p></Card></div>
    {canApply && <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div><h2 className="flex items-center gap-2 font-bold text-[#0F172A]"><Sparkles className="h-5 w-5 text-[#2563EB]"/>AI Scholarship Advisor</h2><p className="mt-1 text-sm text-[#64748B]">Get personalized matches from your profile and active scholarships.</p></div>
        <Button onClick={() => void handleAiAdvice()} loading={aiLoading}><Sparkles className="h-4 w-4"/>Generate advice</Button>
      </div>
      {aiError && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{aiError}</div>}
      {aiAdvice && <div className="mt-4 whitespace-pre-wrap rounded-xl border border-[#E7EDF6] bg-[#F8FAFC] p-4 text-sm leading-6 text-[#334155]">{aiAdvice}</div>}
    </Card>}
    {isAdmin && formOpen && <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between gap-3"><div><h2 className="font-bold text-[#0F172A]">{editingId ? "Edit scholarship" : "Add scholarship"}</h2><p className="text-sm text-[#64748B]">Manage the opportunity shown to students.</p></div><Button type="button" variant="ghost" size="sm" onClick={resetForm}><X className="h-4 w-4"/>Close</Button></div>
        {formError && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{formError}</div>}
        <div className="grid gap-4 md:grid-cols-2"><Input label="Name" value={form.name} onChange={(event) => updateField("name", event.target.value)} required/><Input label="Provider" value={form.provider} onChange={(event) => updateField("provider", event.target.value)} required/><Select label="Type" value={form.type} onChange={(event) => updateField("type", event.target.value)} options={types.map((item) => ({ value: item, label: pretty(item) }))}/><Input label="Amount" type="number" min="0" step="0.01" value={form.amount} onChange={(event) => updateField("amount", event.target.value)} required/><Input label="Currency" value={form.currency} onChange={(event) => updateField("currency", event.target.value)}/><Select label="Status" value={form.status} onChange={(event) => updateField("status", event.target.value)} options={[{ value: "active", label: "Active" }, { value: "upcoming", label: "Upcoming" }, { value: "expired", label: "Expired" }]}/><Input label="Deadline" type="date" value={form.deadline} onChange={(event) => updateField("deadline", event.target.value)}/><Input label="Application URL" value={form.applicationUrl} onChange={(event) => updateField("applicationUrl", event.target.value)}/><Input label="Countries" placeholder="usa, uk, canada" value={form.countries} onChange={(event) => updateField("countries", event.target.value)}/><Input label="Universities" placeholder="Harvard, Oxford" value={form.universities} onChange={(event) => updateField("universities", event.target.value)}/></div>
        <div className="grid gap-4 md:grid-cols-2"><Textarea label="Description" value={form.description} onChange={(event) => updateField("description", event.target.value)}/><Textarea label="Eligibility" value={form.eligibility} onChange={(event) => updateField("eligibility", event.target.value)}/></div>
        <Input label="Requirements" placeholder="GPA 3.5, IELTS 7.0, essay" value={form.requirements} onChange={(event) => updateField("requirements", event.target.value)}/>
        <div className="flex flex-wrap justify-end gap-3"><Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button><Button type="submit" loading={saving}><Save className="h-4 w-4"/>{editingId ? "Update" : "Create"}</Button></div>
      </form>
    </Card>}
    {adminMessage && <div className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{adminMessage}</div>}
    <Card><div className="grid gap-3 md:grid-cols-4"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"/><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search scholarships" className="pl-10"/></div><select value={type} onChange={(event) => setType(event.target.value)} className="rounded-xl border px-3 text-sm"><option value="">All types</option>{types.map((item) => <option key={item} value={item}>{pretty(item)}</option>)}</select><select value={country} onChange={(event) => setCountry(event.target.value)} className="rounded-xl border px-3 text-sm"><option value="">All countries</option>{countries.map((item) => <option key={item} value={item}>{item.toUpperCase()}</option>)}</select><select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border px-3 text-sm"><option value="">All statuses</option><option value="active">Active</option><option value="upcoming">Upcoming</option><option value="expired">Expired</option></select></div></Card>
    {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    {loading ? <div className="grid gap-6 md:grid-cols-3">{[1,2,3].map((item) => <SkeletonCard key={item}/>)}</div> : <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{items.map((item) => <Card key={item.id} className="flex flex-col">
      <div className="flex items-start justify-between gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF5FF]"><Award className="h-5 w-5 text-[#2563EB]"/></div><Badge variant={item.status === "active" ? "success" : item.status === "upcoming" ? "info" : "default"}>{pretty(item.status)}</Badge></div><h2 className="mt-4 font-bold text-[#0F172A]">{item.name}</h2><p className="text-sm text-[#64748B]">{item.provider}</p><p className="mt-3 text-2xl font-bold text-[#22C55E]">{item.currency} {item.amount.toLocaleString()}</p><p className="mt-2 line-clamp-3 text-sm text-[#64748B]">{item.description || item.eligibility}</p>
      <div className="mt-4 flex flex-wrap gap-2">{item.countries.map((value) => <span key={value} className="rounded-full bg-[#F8FAFC] px-2 py-1 text-xs">{value.toUpperCase()}</span>)}<span className="rounded-full bg-purple-50 px-2 py-1 text-xs text-[#7C3AED]">{pretty(item.type)}</span></div>
      <div className="mt-auto flex items-center justify-between gap-3 border-t pt-4"><span className="flex items-center gap-1 text-xs text-[#64748B]"><CalendarDays className="h-4 w-4"/>{item.deadline ? new Date(item.deadline).toLocaleDateString() : "Open deadline"}</span><div className="flex flex-wrap justify-end gap-2">{isAdmin && <><Button size="sm" variant="secondary" onClick={() => startEdit(item)}><Pencil className="h-4 w-4"/>Edit</Button><Button size="sm" variant="danger" onClick={() => void handleDelete(item)}><Trash2 className="h-4 w-4"/>Delete</Button></>}{canApply && item.applicationUrl && <Button size="sm" onClick={() => window.open(item.applicationUrl, "_blank", "noopener,noreferrer")}>Apply <ExternalLink className="h-4 w-4"/></Button>}</div></div>
    </Card>)}</div>}
    {!loading && items.length === 0 && <Card><p className="text-center text-sm text-[#64748B]">No scholarships match these filters.</p></Card>}
  </div>;
}
