"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus, Search, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { createAppointment } from "@/lib/api/appointment.api";
import { getCounsellors, type Counsellor } from "@/lib/api/counsellor.api";

const specialties = ["university-admissions", "visa-guidance", "scholarship-advising", "career-counseling", "test-preparation", "general-advising"];
const pretty = (value: string) => value.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");

export default function CounsellorsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selected, setSelected] = useState<Counsellor | null>(null);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => { if (!authLoading && !user) router.push("/login"); }, [authLoading, user, router]);
  const load = useCallback(async () => {
    setLoading(true);
    const response = await getCounsellors(availableOnly || undefined, specialty || undefined);
    setCounsellors(response.data || []);
    setLoading(false);
  }, [availableOnly, specialty]);
  useEffect(() => { if (user) void load(); }, [user, load]);

  const filtered = useMemo(() => counsellors.filter((item) => `${item.fullName} ${item.email} ${item.specialties.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [counsellors, query]);

  async function book(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    try {
      setSaving(true);
      const response = await createAppointment({ counsellorId: selected.id, date, startTime, endTime, notes: notes || undefined });
      if (!response.success) throw new Error(response.message);
      setNotice(`Appointment booked with ${selected.fullName}.`);
      setSelected(null);
      setDate(""); setNotes("");
    } catch (cause) { setNotice(cause instanceof Error ? cause.message : "Unable to book appointment"); }
    finally { setSaving(false); }
  }

  if (authLoading || loading) return <div className="grid gap-6 md:grid-cols-3">{[1,2,3].map((item) => <SkeletonCard key={item}/>)}</div>;
  if (!user) return null;

  return <div className="space-y-6">
    <div><h1 className="text-3xl font-bold text-[#0F172A]">Counsellors</h1><p className="mt-1 text-sm text-[#64748B]">Find an adviser and book a real appointment.</p></div>
    {notice && <div className="rounded-xl bg-[#EEF5FF] p-3 text-sm text-[#1D4ED8]">{notice}</div>}
    <Card><div className="flex flex-col gap-3 md:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"/><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search counsellors" className="pl-10"/></div><select value={specialty} onChange={(event) => setSpecialty(event.target.value)} className="rounded-xl border px-4 text-sm"><option value="">All specialties</option>{specialties.map((item) => <option key={item} value={item}>{pretty(item)}</option>)}</select><label className="flex items-center gap-2 text-sm text-[#64748B]"><input type="checkbox" checked={availableOnly} onChange={(event) => setAvailableOnly(event.target.checked)}/>Available only</label></div></Card>
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{filtered.map((item) => <Card key={item.id} className="flex flex-col">
      <div className="flex items-start gap-4"><Avatar src={item.imageUrl} fallback={item.fullName} size="lg"/><div className="min-w-0 flex-1"><h2 className="truncate font-bold text-[#0F172A]">{item.fullName}</h2><p className="truncate text-xs text-[#64748B]">{item.email}</p><div className="mt-1 flex items-center gap-1 text-sm"><Star className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]"/>{item.rating.toFixed(1)} <span className="text-[#94A3B8]">({item.reviewCount})</span></div></div><Badge variant={item.available ? "success" : "default"}>{item.available ? "Available" : "Unavailable"}</Badge></div>
      <p className="mt-4 line-clamp-3 text-sm text-[#64748B]">{item.bio || "Experienced international education adviser."}</p><div className="mt-4 flex flex-wrap gap-2">{item.specialties.map((value) => <span key={value} className="rounded-full bg-[#EEF5FF] px-2 py-1 text-xs text-[#2563EB]">{pretty(value)}</span>)}</div>
      <div className="mt-auto flex items-center justify-between border-t pt-4"><div><p className="text-xs text-[#64748B]">Experience</p><p className="text-sm font-semibold">{item.yearsOfExperience} years · ${item.hourlyRate}/hr</p></div><Button disabled={!item.available} onClick={() => setSelected(item)} size="sm"><CalendarPlus className="h-4 w-4"/>Book</Button></div>
    </Card>)}</div>
    {filtered.length === 0 && <Card><p className="text-center text-sm text-[#64748B]">No counsellors match these filters.</p></Card>}
    <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title={`Book ${selected?.fullName || "counsellor"}`}><form onSubmit={book} className="space-y-4"><label className="block text-sm font-medium">Date<Input required min={new Date().toISOString().slice(0,10)} type="date" value={date} onChange={(event) => setDate(event.target.value)} className="mt-1"/></label><div className="grid grid-cols-2 gap-3"><label className="text-sm font-medium">Start<Input required type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} className="mt-1"/></label><label className="text-sm font-medium">End<Input required type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} className="mt-1"/></label></div><label className="block text-sm font-medium">Notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-1 min-h-24 w-full rounded-xl border p-3 text-sm" placeholder="What would you like to discuss?"/></label><Button type="submit" loading={saving} className="w-full">Confirm appointment</Button></form></Modal>
  </div>;
}
