"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, FileCheck2, Plane, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { getMyApplications, type Application } from "@/lib/api/application.api";
import { getCounsellors, type Counsellor } from "@/lib/api/counsellor.api";
import { createVisaCase, deleteVisaCase, getVisaCases, updateVisaCase, visaStatuses, type VisaCase } from "@/lib/api/visa.api";

const pretty = (value: string) => value.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
const statusVariant = (status: string) => status === "approved" ? "success" : status === "refused" ? "danger" : status.includes("scheduled") ? "warning" : "info";

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

  return <div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Visa Processing</h1><p className="mt-1 text-sm text-[#64748B]">{user.role === "student" ? "Track your study visa journey." : user.role === "counsellor" ? "Manage your assigned visa cases." : "Manage visa cases across the platform."}</p></div>
      {user.role === "student" && <Button onClick={openCreate} disabled={eligibleApplications.length === 0}><Plus className="h-4 w-4"/>Start visa case</Button>}
    </div>
    {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    <div className="grid gap-4 sm:grid-cols-3"><Card><p className="text-sm text-[#64748B]">Total cases</p><p className="mt-1 text-2xl font-bold">{cases.length}</p></Card><Card><p className="text-sm text-[#64748B]">Active</p><p className="mt-1 text-2xl font-bold text-[#2563EB]">{active}</p></Card><Card><p className="text-sm text-[#64748B]">Approved</p><p className="mt-1 text-2xl font-bold text-[#22C55E]">{approved}</p></Card></div>
    {user.role === "student" && eligibleApplications.length === 0 && applications.some((item) => item.status !== "accepted") && cases.length === 0 && <Card className="border-[#F59E0B]/30 bg-[#FFF9EE]"><p className="text-sm text-[#92400E]">A visa case becomes available after a university application is accepted.</p></Card>}
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {cases.map((item) => <Card key={item.id} className="flex flex-col">
        <div className="flex items-start justify-between gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-[#EEF5FF]"><Plane className="h-5 w-5 text-[#2563EB]"/></div><Badge variant={statusVariant(item.status)}>{pretty(item.status)}</Badge></div>
        <h2 className="mt-4 font-bold text-[#0F172A]">{item.program || `${item.country} visa`}</h2>{item.studentName && <p className="mt-1 text-xs text-[#64748B]">{item.studentName}</p>}
        <div className="mt-4 space-y-2 text-sm text-[#64748B]"><p><span className="font-medium text-[#0F172A]">Destination:</span> {item.country}</p><p><span className="font-medium text-[#0F172A]">Visa type:</span> {item.visaType}</p>{item.referenceNumber && <p><span className="font-medium text-[#0F172A]">Reference:</span> {item.referenceNumber}</p>}{item.appointmentDate && <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4"/>{new Date(item.appointmentDate).toLocaleDateString()}</p>}</div>
        {user.role !== "student" && <Button variant="secondary" className="mt-5 w-full" onClick={() => setSelected(item)}><FileCheck2 className="h-4 w-4"/>Manage case</Button>}
      </Card>)}
    </div>
    {cases.length === 0 && <Card className="py-14 text-center"><Plane className="mx-auto h-10 w-10 text-[#94A3B8]"/><h2 className="mt-4 font-bold">No visa cases yet</h2><p className="mt-1 text-sm text-[#64748B]">{user.role === "student" ? "Accepted applications will be eligible to start here." : "Cases assigned to your workspace will appear here."}</p></Card>}

    <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Start visa case"><form onSubmit={createCase} className="space-y-4"><label className="block text-sm font-medium">Accepted application<select required value={applicationId} onChange={(event) => setApplicationId(event.target.value)} className="mt-1 h-11 w-full rounded-xl border px-3 text-sm">{eligibleApplications.map((item) => <option key={item.id} value={item.id}>{item.program}</option>)}</select></label><Input required label="Destination country" value={country} onChange={(event) => setCountry(event.target.value)}/><Input required label="Visa type" value={visaType} onChange={(event) => setVisaType(event.target.value)}/><Button type="submit" loading={saving} className="w-full">Create case</Button></form></Modal>

    <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title="Manage visa case" size="lg">{selected && <form onSubmit={saveCase} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Status<select value={selected.status} onChange={(event) => setSelected({ ...selected, status: event.target.value as VisaCase["status"] })} className="mt-1 h-11 w-full rounded-xl border px-3 text-sm">{visaStatuses.map((status) => <option key={status} value={status}>{pretty(status)}</option>)}</select></label>{user.role === "admin" && <label className="text-sm font-medium">Assigned counsellor<select value={selected.counsellorId || ""} onChange={(event) => setSelected({ ...selected, counsellorId: event.target.value || null })} className="mt-1 h-11 w-full rounded-xl border px-3 text-sm"><option value="">Unassigned</option>{counsellors.map((item) => <option key={item.id} value={item.id}>{item.fullName}</option>)}</select></label>}<Input label="Reference number" value={selected.referenceNumber || ""} onChange={(event) => setSelected({ ...selected, referenceNumber: event.target.value })}/><Input type="date" label="Submission date" value={selected.submissionDate?.slice(0, 10) || ""} onChange={(event) => setSelected({ ...selected, submissionDate: event.target.value })}/><Input type="date" label="Appointment date" value={selected.appointmentDate?.slice(0, 10) || ""} onChange={(event) => setSelected({ ...selected, appointmentDate: event.target.value })}/><Input type="date" label="Decision date" value={selected.decisionDate?.slice(0, 10) || ""} onChange={(event) => setSelected({ ...selected, decisionDate: event.target.value })}/></div><label className="block text-sm font-medium">Case notes<textarea value={selected.notes || ""} onChange={(event) => setSelected({ ...selected, notes: event.target.value })} className="mt-1 min-h-28 w-full rounded-xl border p-3 text-sm"/></label><div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">{user.role === "admin" ? <Button type="button" variant="danger" loading={saving} onClick={() => void removeCase()}><Trash2 className="h-4 w-4"/>Delete</Button> : <span/>}<Button type="submit" loading={saving}>Save changes</Button></div></form>}</Modal>
  </div>;
}
