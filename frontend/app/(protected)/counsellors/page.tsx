"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus, Edit, Plus, Search, Star, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Textarea } from "@/components/ui/Textarea";
import { createAppointment } from "@/lib/api/appointment.api";
import { getUsers } from "@/lib/api/admin.api";
import { createCounsellor, deleteCounsellor, getCounsellors, updateCounsellor, type Counsellor, type CreateCounsellorPayload, type UpdateCounsellorPayload } from "@/lib/api/counsellor.api";
import type { AdminUser } from "@/lib/api/types";

const specialties = ["university-admissions", "visa-guidance", "scholarship-advising", "career-counseling", "test-preparation", "general-advising"];
const pretty = (value: string) => value.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");

type CounsellorForm = {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  bio: string;
  specialties: string[];
  yearsOfExperience: string;
  hourlyRate: string;
  imageUrl: string;
  available: boolean;
};

const emptyCounsellorForm: CounsellorForm = {
  userId: "",
  fullName: "",
  email: "",
  phoneNumber: "",
  bio: "",
  specialties: [],
  yearsOfExperience: "0",
  hourlyRate: "0",
  imageUrl: "",
  available: true,
};

function formFromCounsellor(counsellor: Counsellor): CounsellorForm {
  return {
    userId: counsellor.userId,
    fullName: counsellor.fullName,
    email: counsellor.email,
    phoneNumber: counsellor.phoneNumber,
    bio: counsellor.bio || "",
    specialties: counsellor.specialties,
    yearsOfExperience: String(counsellor.yearsOfExperience),
    hourlyRate: String(counsellor.hourlyRate),
    imageUrl: counsellor.imageUrl || "",
    available: counsellor.available,
  };
}

export default function CounsellorsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selected, setSelected] = useState<Counsellor | null>(null);
  const [editing, setEditing] = useState<Counsellor | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<CounsellorForm>(emptyCounsellorForm);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => { if (!authLoading && !user) router.push("/login"); }, [authLoading, user, router]);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [counsellorResult, userResult] = await Promise.all([
        getCounsellors(availableOnly || undefined, specialty || undefined),
        user.role === "admin" ? getUsers(1, 100) : Promise.resolve(null),
      ]);
      setCounsellors(counsellorResult.data || []);
      setUsers(userResult?.data || []);
      setNotice("");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to load counsellors");
    } finally {
      setLoading(false);
    }
  }, [availableOnly, specialty, user]);

  useEffect(() => {
    if (!user) return;
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [user, load]);

  const filtered = useMemo(() => counsellors.filter((item) => `${item.fullName} ${item.email} ${item.specialties.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [counsellors, query]);
  const counsellorUsers = useMemo(() => users.filter((item) => item.role === "counsellor"), [users]);

  function openCreate() {
    setEditing(null);
    setForm(emptyCounsellorForm);
    setFormOpen(true);
  }

  function openEdit(counsellor: Counsellor) {
    setEditing(counsellor);
    setForm(formFromCounsellor(counsellor));
    setFormOpen(true);
  }

  function updateForm(name: keyof CounsellorForm, value: string | boolean | string[]) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function toggleSpecialty(value: string) {
    setForm((current) => ({
      ...current,
      specialties: current.specialties.includes(value)
        ? current.specialties.filter((item) => item !== value)
        : [...current.specialties, value],
    }));
  }

  function selectUser(userId: string) {
    const selectedUser = users.find((item) => item.id === userId);
    setForm((current) => ({
      ...current,
      userId,
      fullName: selectedUser?.fullName || current.fullName,
      email: selectedUser?.email || current.email,
      phoneNumber: selectedUser?.phoneNumber || current.phoneNumber,
    }));
  }

  function createPayload(): CreateCounsellorPayload {
    return {
      userId: form.userId,
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phoneNumber: form.phoneNumber.trim(),
      bio: form.bio.trim() || undefined,
      specialties: form.specialties,
      yearsOfExperience: Number(form.yearsOfExperience || 0),
      hourlyRate: Number(form.hourlyRate || 0),
      imageUrl: form.imageUrl.trim() || undefined,
    };
  }

  function updatePayload(): UpdateCounsellorPayload {
    const payload = createPayload() as UpdateCounsellorPayload & { userId?: string };
    delete payload.userId;
    return { ...payload, available: form.available };
  }

  async function saveCounsellor(event: FormEvent) {
    event.preventDefault();
    try {
      setSaving(true);
      const response = editing
        ? await updateCounsellor(editing.id, updatePayload())
        : await createCounsellor(createPayload());
      setCounsellors((current) => editing
        ? current.map((item) => item.id === response.data.id ? response.data : item)
        : [response.data, ...current]);
      setEditing(null);
      setFormOpen(false);
      setForm(emptyCounsellorForm);
      setNotice(editing ? "Counsellor updated." : "Counsellor profile created.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to save counsellor");
    } finally {
      setSaving(false);
    }
  }

  async function removeCounsellor(counsellor: Counsellor) {
    if (!window.confirm(`Delete counsellor profile for ${counsellor.fullName}?`)) return;
    try {
      setSaving(true);
      await deleteCounsellor(counsellor.id);
      setCounsellors((current) => current.filter((item) => item.id !== counsellor.id));
      setNotice("Counsellor profile deleted.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to delete counsellor");
    } finally {
      setSaving(false);
    }
  }

  async function book(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    try {
      setSaving(true);
      const response = await createAppointment({ counsellorId: selected.id, date, startTime, endTime, notes: notes || undefined });
      if (!response.success) throw new Error(response.message);
      setNotice(`Appointment booked with ${selected.fullName}.`);
      setSelected(null);
      setDate("");
      setNotes("");
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : "Unable to book appointment");
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || loading) return <div className="grid gap-4 md:grid-cols-3">{[1,2,3].map((item) => <SkeletonCard key={item}/>)}</div>;
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Counsellors</h1>
          <p className="mt-1 text-sm text-[#64748B]">Manage advisers, availability, and student appointment bookings.</p>
        </div>
        {user.role === "admin" && <Button onClick={openCreate}><Plus className="h-4 w-4"/>Add Counsellor</Button>}
      </div>

      {notice && <div className="rounded-xl bg-[#EEF5FF] p-3 text-sm text-[#1D4ED8]">{notice}</div>}

      <Card>
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"/>
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search counsellors" className="pl-10"/>
          </div>
          <select value={specialty} onChange={(event) => setSpecialty(event.target.value)} className="h-11 rounded-xl border px-4 text-sm">
            <option value="">All specialties</option>
            {specialties.map((item) => <option key={item} value={item}>{pretty(item)}</option>)}
          </select>
          <label className="flex items-center gap-2 text-sm text-[#64748B]"><input type="checkbox" checked={availableOnly} onChange={(event) => setAvailableOnly(event.target.checked)}/>Available only</label>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => (
          <Card key={item.id} className="flex flex-col">
            <div className="flex items-start gap-4">
              <Avatar src={item.imageUrl} fallback={item.fullName} size="lg"/>
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-bold text-[#0F172A]">{item.fullName}</h2>
                <p className="truncate text-xs text-[#64748B]">{item.email}</p>
                <div className="mt-1 flex items-center gap-1 text-sm"><Star className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]"/>{item.rating.toFixed(1)} <span className="text-[#94A3B8]">({item.reviewCount})</span></div>
              </div>
              <Badge variant={item.available ? "success" : "default"}>{item.available ? "Available" : "Unavailable"}</Badge>
            </div>
            <p className="mt-4 line-clamp-3 text-sm text-[#64748B]">{item.bio || "Experienced international education adviser."}</p>
            <div className="mt-4 flex flex-wrap gap-2">{item.specialties.map((value) => <span key={value} className="rounded-full bg-[#EEF5FF] px-2 py-1 text-xs text-[#2563EB]">{pretty(value)}</span>)}</div>
            <div className="mt-auto flex items-center justify-between gap-3 border-t pt-4">
              <div><p className="text-xs text-[#64748B]">Experience</p><p className="text-sm font-semibold">{item.yearsOfExperience} years · ${item.hourlyRate}/hr</p></div>
              {user.role === "admin" ? (
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => openEdit(item)}><Edit className="h-4 w-4"/>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => void removeCounsellor(item)}><Trash2 className="h-4 w-4"/></Button>
                </div>
              ) : (
                <Button disabled={!item.available || user.role !== "student"} onClick={() => setSelected(item)} size="sm"><CalendarPlus className="h-4 w-4"/>Book</Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && <Card><p className="text-center text-sm text-[#64748B]">No counsellors match these filters.</p></Card>}

      <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title={`Book ${selected?.fullName || "counsellor"}`}>
        <form onSubmit={book} className="space-y-4">
          <label className="block text-sm font-medium">Date<Input required min={new Date().toISOString().slice(0,10)} type="date" value={date} onChange={(event) => setDate(event.target.value)} className="mt-1"/></label>
          <div className="grid grid-cols-2 gap-3"><label className="text-sm font-medium">Start<Input required type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} className="mt-1"/></label><label className="text-sm font-medium">End<Input required type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} className="mt-1"/></label></div>
          <Textarea label="Notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="What would you like to discuss?"/>
          <Button type="submit" loading={saving} className="w-full">Confirm appointment</Button>
        </form>
      </Modal>

      <Modal isOpen={user.role === "admin" && formOpen} onClose={() => { setEditing(null); setFormOpen(false); setForm(emptyCounsellorForm); }} title={editing ? "Edit Counsellor" : "Add Counsellor"} size="lg">
        <form onSubmit={saveCounsellor} className="space-y-4">
          {!editing && (
            <label className="block text-sm font-medium text-[#0F172A]">
              Counsellor User
              <select required value={form.userId} onChange={(event) => selectUser(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-[#DDE5EF] bg-white px-4 text-sm">
                <option value="">Select a counsellor account</option>
                {counsellorUsers.map((item) => <option key={item.id} value={item.id}>{item.fullName} · {item.email}</option>)}
              </select>
            </label>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <Input required label="Full Name" value={form.fullName} onChange={(event) => updateForm("fullName", event.target.value)} />
            <Input required label="Email" type="email" value={form.email} onChange={(event) => updateForm("email", event.target.value)} />
            <Input required label="Phone" value={form.phoneNumber} onChange={(event) => updateForm("phoneNumber", event.target.value)} />
            <Input label="Image URL" value={form.imageUrl} onChange={(event) => updateForm("imageUrl", event.target.value)} />
            <Input label="Years of Experience" type="number" min="0" step="1" value={form.yearsOfExperience} onChange={(event) => updateForm("yearsOfExperience", event.target.value)} />
            <Input label="Hourly Rate" type="number" min="0" step="1" value={form.hourlyRate} onChange={(event) => updateForm("hourlyRate", event.target.value)} />
          </div>
          <Textarea label="Bio" value={form.bio} onChange={(event) => updateForm("bio", event.target.value)} maxLength={1000} />
          <div>
            <p className="mb-2 text-sm font-medium text-[#0F172A]">Specialties</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {specialties.map((item) => <label key={item} className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={form.specialties.includes(item)} onChange={() => toggleSpecialty(item)}/>{pretty(item)}</label>)}
            </div>
          </div>
          {editing && <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={form.available} onChange={(event) => updateForm("available", event.target.checked)}/>Available for bookings</label>}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={() => { setEditing(null); setFormOpen(false); setForm(emptyCounsellorForm); }}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? "Save Changes" : "Create Counsellor"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
