"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Clock, FileCheck2, Plane, Plus, Search, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Textarea } from "@/components/ui/Textarea";
import { getMyApplications, type Application } from "@/lib/api/application.api";
import { getCounsellors, type Counsellor } from "@/lib/api/counsellor.api";
import { createVisaCase, deleteVisaCase, getVisaCases, updateVisaCase, visaStatuses, type VisaCase } from "@/lib/api/visa.api";

const pretty = (value: string) => value.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
const statusVariant = (status: string) => status === "approved" ? "success" : status === "refused" ? "danger" : status.includes("scheduled") ? "warning" : "info";
const processSteps = [
  { status: "documents-preparing", title: "Prepare documents", detail: "Collect passport, offer letter, funds, academic records, and supporting forms." },
  { status: "ready-to-submit", title: "Ready to submit", detail: "Counsellor has reviewed documents and the case is ready for lodgement." },
  { status: "submitted", title: "Submitted", detail: "Application has been submitted and reference number should be recorded." },
  { status: "biometrics-scheduled", title: "Biometrics", detail: "Biometrics appointment has been scheduled or completed." },
  { status: "interview-scheduled", title: "Interview", detail: "Interview appointment or preparation is scheduled where required." },
  { status: "under-review", title: "Under review", detail: "Case is with the embassy or immigration authority for review." },
  { status: "approved", title: "Decision", detail: "Visa approved. Prepare travel and enrollment next steps." },
] as const;
const requiredDocuments = ["Passport", "Offer letter / COE", "Academic transcripts", "Financial evidence", "English test result", "SOP / study plan", "Visa forms", "Passport photo"];
const statusIndex = (status: string) => status === "refused" ? processSteps.length - 1 : Math.max(0, processSteps.findIndex((step) => step.status === status));
const progressFor = (status: string) => status === "refused" ? 100 : Math.round(((statusIndex(status) + 1) / processSteps.length) * 100);
const nextAction = (status: string) => {
  const actions: Record<string, string> = {
    "documents-preparing": "Upload missing documents and ask your counsellor to review readiness.",
    "ready-to-submit": "Submit the application and record the reference number.",
    submitted: "Track biometrics or appointment instructions from the visa portal.",
    "biometrics-scheduled": "Attend biometrics and update the case once completed.",
    "interview-scheduled": "Prepare interview answers and attend on the scheduled date.",
    "under-review": "Monitor the portal and wait for the decision.",
    approved: "Prepare travel, accommodation, and enrollment steps.",
    refused: "Review refusal notes and plan next options with a counsellor.",
  };
  return actions[status] || "Review the case and update the next milestone.";
};

export default function VisaPage() {
  const { user, loading: authLoading } = useAuth();
  const [cases, setCases] = useState<VisaCase[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<VisaCase | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [country, setCountry] = useState("");
  const [visaType, setVisaType] = useState("Student visa");

  const load = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [visaResult, applicationResult, counsellorResult] = await Promise.all([
        getVisaCases(),
        user.role === "student" ? getMyApplications() : Promise.resolve(null),
        user.role === "admin" ? getCounsellors() : Promise.resolve(null),
      ]);
      setCases(visaResult.data || []);
      setApplications(applicationResult?.data || []);
      setCounsellors(counsellorResult?.data || []);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load visa cases");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load, user]);

  const eligibleApplications = useMemo(() => applications.filter(
    (application) => application.status === "accepted" && !cases.some((item) => item.applicationId === application.id),
  ), [applications, cases]);

  function openCreate() {
      setApplicationId(eligibleApplications[0]?.id || "");
    setCountry(user?.destination ? pretty(user.destination) : "");
    setVisaType("Student visa");
    setShowCreate(true);
  }

  async function createCase(event: FormEvent) {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      await createVisaCase({ applicationId, country: country.trim(), visaType: visaType.trim() });
      setShowCreate(false);
      setMessage("Visa case started.");
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to create visa case");
    } finally {
      setSaving(false);
    }
  }

  async function saveCase(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    try {
      setSaving(true);
      setError("");
      await updateVisaCase(selected.id, {
        ...(user?.role === "admin" ? { counsellorId: selected.counsellorId || null } : {}),
        status: selected.status,
        referenceNumber: selected.referenceNumber || "",
        submissionDate: selected.submissionDate || "",
        appointmentDate: selected.appointmentDate || "",
        decisionDate: selected.decisionDate || "",
        notes: selected.notes || "",
      });
      setSelected(null);
      setMessage("Visa case updated.");
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to update visa case");
    } finally {
      setSaving(false);
    }
  }

  async function removeCase() {
    if (!selected) return;
    if (!window.confirm("Delete this visa case permanently?")) return;
    try {
      setSaving(true);
      await deleteVisaCase(selected.id);
      setSelected(null);
      setMessage("Visa case deleted.");
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to delete visa case");
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || loading) return <div className="grid gap-4 md:grid-cols-2">{[1, 2, 3, 4].map((item) => <SkeletonCard key={item}/>)}</div>;
  if (!user) return null;

  const approved = cases.filter((item) => item.status === "approved").length;
  const active = cases.filter((item) => !["approved", "refused"].includes(item.status)).length;
  const awaitingDecision = cases.filter((item) => ["submitted", "biometrics-scheduled", "interview-scheduled", "under-review"].includes(item.status)).length;
  const counsellorNames = new Map(counsellors.map((item) => [item.id, item.fullName]));
  const filteredCases = cases.filter((item) => {
    const haystack = `${item.program || ""} ${item.studentName || ""} ${item.country} ${item.visaType} ${item.referenceNumber || ""}`.toLowerCase();
    return (!statusFilter || item.status === statusFilter) && (!search || haystack.includes(search.toLowerCase()));
  });
  const canManage = user.role === "admin" || user.role === "counsellor";
  async function quickStatus(status: VisaCase["status"]) {
    if (!selected) return;
    setSelected({ ...selected, status });
  }

  return <div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Visa Processing</h1><p className="mt-1 text-sm text-[#64748B]">{user.role === "student" ? "Track your study visa journey." : user.role === "counsellor" ? "Manage your assigned visa cases." : "Manage visa cases across the platform."}</p></div>
      {user.role === "student" && <Button onClick={openCreate} disabled={eligibleApplications.length === 0}><Plus className="h-4 w-4"/>Start visa case</Button>}
    </div>
    {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    {message && <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">{message}</div>}
    <div className="grid gap-4 sm:grid-cols-4"><Card><p className="text-sm text-[#64748B]">Total cases</p><p className="mt-1 text-2xl font-bold">{cases.length}</p></Card><Card><p className="text-sm text-[#64748B]">Active</p><p className="mt-1 text-2xl font-bold text-[#2563EB]">{active}</p></Card><Card><p className="text-sm text-[#64748B]">Awaiting decision</p><p className="mt-1 text-2xl font-bold text-[#F59E0B]">{awaitingDecision}</p></Card><Card><p className="text-sm text-[#64748B]">Approved</p><p className="mt-1 text-2xl font-bold text-[#22C55E]">{approved}</p></Card></div>
    <Card><div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"/><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search student, country, program, reference" className="pl-10"/></div><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-11 rounded-xl border border-[#DDE5EF] px-3 text-sm"><option value="">All statuses</option>{visaStatuses.map((status) => <option key={status} value={status}>{pretty(status)}</option>)}</select></div></Card>
    {user.role === "student" && eligibleApplications.length === 0 && applications.some((item) => item.status !== "accepted") && cases.length === 0 && <Card className="border-[#F59E0B]/30 bg-[#FFF9EE]"><p className="text-sm text-[#92400E]">A visa case becomes available after a university application is accepted.</p></Card>}
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {filteredCases.map((item) => <Card key={item.id} className="flex flex-col">
        <div className="flex items-start justify-between gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-[#EEF5FF]"><Plane className="h-5 w-5 text-[#2563EB]"/></div><Badge variant={statusVariant(item.status)}>{pretty(item.status)}</Badge></div>
        <h2 className="mt-4 font-bold text-[#0F172A]">{item.program || `${item.country} visa`}</h2>{item.studentName && <p className="mt-1 text-xs text-[#64748B]">{item.studentName}</p>}
        <div className="mt-4"><div className="flex items-center justify-between text-xs text-[#64748B]"><span>Progress</span><span>{progressFor(item.status)}%</span></div><div className="mt-2 h-2 rounded-full bg-[#E2E8F0]"><div className={`h-2 rounded-full ${item.status === "refused" ? "bg-[#EF4444]" : "bg-[#2563EB]"}`} style={{ width: `${progressFor(item.status)}%` }}/></div></div>
        <div className="mt-4 space-y-2 text-sm text-[#64748B]"><p><span className="font-medium text-[#0F172A]">Destination:</span> {item.country}</p><p><span className="font-medium text-[#0F172A]">Visa type:</span> {item.visaType}</p>{item.referenceNumber && <p><span className="font-medium text-[#0F172A]">Reference:</span> {item.referenceNumber}</p>}{item.appointmentDate && <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4"/>{new Date(item.appointmentDate).toLocaleDateString()}</p>}</div>
        <Button variant="secondary" className="mt-5 w-full" onClick={() => setSelected(item)}><FileCheck2 className="h-4 w-4"/>{canManage ? "Manage case" : "View process"}</Button>
      </Card>)}
    </div>
    {filteredCases.length === 0 && <Card className="py-14 text-center"><Plane className="mx-auto h-10 w-10 text-[#94A3B8]"/><h2 className="mt-4 font-bold">No visa cases found</h2><p className="mt-1 text-sm text-[#64748B]">{cases.length === 0 ? user.role === "student" ? "Accepted applications will be eligible to start here." : "Cases assigned to your workspace will appear here." : "Try changing the search or status filter."}</p></Card>}

    <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Start visa case"><form onSubmit={createCase} className="space-y-4"><label className="block text-sm font-medium">Accepted application<select required value={applicationId} onChange={(event) => setApplicationId(event.target.value)} className="mt-1 h-11 w-full rounded-xl border px-3 text-sm">{eligibleApplications.map((item) => <option key={item.id} value={item.id}>{item.program}</option>)}</select></label><Input required label="Destination country" value={country} onChange={(event) => setCountry(event.target.value)}/><Input required label="Visa type" value={visaType} onChange={(event) => setVisaType(event.target.value)}/><Button type="submit" loading={saving} className="w-full">Create case</Button></form></Modal>

    <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title={canManage ? "Manage visa case" : "Visa process"} size="lg">{selected && <div className="space-y-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold text-[#0F172A]">{selected.program || `${selected.country} visa`}</p><p className="mt-1 text-sm text-[#64748B]">{selected.studentName || "Your visa case"} · {selected.country}</p>{selected.counsellorId && <p className="mt-1 text-xs text-[#64748B]">Counsellor: {counsellorNames.get(selected.counsellorId) || selected.counsellorId}</p>}</div><Badge variant={statusVariant(selected.status)}>{pretty(selected.status)}</Badge></div>
      <div className="rounded-xl border border-[#E7EDF6] p-4"><div className="flex items-center justify-between text-sm"><span className="font-semibold text-[#0F172A]">Current progress</span><span className="text-[#64748B]">{progressFor(selected.status)}%</span></div><div className="mt-3 h-2 rounded-full bg-[#E2E8F0]"><div className={`h-2 rounded-full ${selected.status === "refused" ? "bg-[#EF4444]" : "bg-[#2563EB]"}`} style={{ width: `${progressFor(selected.status)}%` }}/></div><p className="mt-3 text-sm text-[#64748B]">{nextAction(selected.status)}</p></div>
      <div className="space-y-3">{processSteps.map((step, index) => { const done = selected.status === "refused" ? index < processSteps.length - 1 : index <= statusIndex(selected.status); return <div key={step.status} className="flex gap-3"><span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${done ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#F1F5F9] text-[#94A3B8]"}`}>{done ? <CheckCircle2 className="h-4 w-4"/> : <Clock className="h-4 w-4"/>}</span><div><p className="text-sm font-semibold text-[#0F172A]">{step.title}</p><p className="text-sm text-[#64748B]">{step.detail}</p></div></div>; })}</div>
      <div className="rounded-xl bg-[#F8FAFC] p-4"><p className="text-sm font-semibold text-[#0F172A]">Document readiness checklist</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{requiredDocuments.map((item) => <div key={item} className="flex items-center gap-2 text-sm text-[#64748B]"><CheckCircle2 className="h-4 w-4 text-[#22C55E]"/>{item}</div>)}</div><p className="mt-3 text-xs text-[#64748B]">Use your profile document vault to upload and update these files for staff verification.</p></div>
      {canManage && <form onSubmit={saveCase} className="space-y-4 border-t pt-4"><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Status<select value={selected.status} onChange={(event) => setSelected({ ...selected, status: event.target.value as VisaCase["status"] })} className="mt-1 h-11 w-full rounded-xl border px-3 text-sm">{visaStatuses.map((status) => <option key={status} value={status}>{pretty(status)}</option>)}</select></label>{user.role === "admin" && <label className="text-sm font-medium">Assigned counsellor<select value={selected.counsellorId || ""} onChange={(event) => setSelected({ ...selected, counsellorId: event.target.value || null })} className="mt-1 h-11 w-full rounded-xl border px-3 text-sm"><option value="">Unassigned</option>{counsellors.map((item) => <option key={item.id} value={item.id}>{item.fullName}</option>)}</select></label>}<Input label="Reference number" value={selected.referenceNumber || ""} onChange={(event) => setSelected({ ...selected, referenceNumber: event.target.value })}/><Input type="date" label="Submission date" value={selected.submissionDate?.slice(0, 10) || ""} onChange={(event) => setSelected({ ...selected, submissionDate: event.target.value })}/><Input type="date" label="Appointment date" value={selected.appointmentDate?.slice(0, 10) || ""} onChange={(event) => setSelected({ ...selected, appointmentDate: event.target.value })}/><Input type="date" label="Decision date" value={selected.decisionDate?.slice(0, 10) || ""} onChange={(event) => setSelected({ ...selected, decisionDate: event.target.value })}/></div><div className="flex flex-wrap gap-2">{visaStatuses.map((status) => <Button key={status} type="button" size="sm" variant={selected.status === status ? "primary" : "secondary"} onClick={() => void quickStatus(status)}>{pretty(status)}</Button>)}</div><Textarea label="Case notes" value={selected.notes || ""} onChange={(event) => setSelected({ ...selected, notes: event.target.value })}/><div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">{user.role === "admin" ? <Button type="button" variant="danger" loading={saving} onClick={() => void removeCase()}><Trash2 className="h-4 w-4"/>Delete</Button> : <span/>}<Button type="submit" loading={saving}>Save changes</Button></div></form>}
      {!canManage && <div className="grid gap-3 text-sm sm:grid-cols-2"><p><span className="font-medium text-[#0F172A]">Reference:</span> {selected.referenceNumber || "Not added yet"}</p><p><span className="font-medium text-[#0F172A]">Submission:</span> {selected.submissionDate ? new Date(selected.submissionDate).toLocaleDateString() : "Pending"}</p><p><span className="font-medium text-[#0F172A]">Appointment:</span> {selected.appointmentDate ? new Date(selected.appointmentDate).toLocaleDateString() : "Pending"}</p><p><span className="font-medium text-[#0F172A]">Decision:</span> {selected.decisionDate ? new Date(selected.decisionDate).toLocaleDateString() : "Pending"}</p>{selected.notes && <p className="sm:col-span-2"><span className="font-medium text-[#0F172A]">Notes:</span> {selected.notes}</p>}</div>}</div>}</Modal>
  </div>;
}
