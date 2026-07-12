"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar as CalendarIcon, Clock, List, Video, XCircle } from "lucide-react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { cancelAppointment, getAllAppointments, getMyAppointments, type Appointment } from "@/lib/api/appointment.api";
import { getCounsellors, type Counsellor } from "@/lib/api/counsellor.api";

const localizer = momentLocalizer(moment);
type AppointmentEvent = { id: string; title: string; start: Date; end: Date; resource: Appointment };

function appointmentDate(date: string, time: string) {
  return new Date(`${date.slice(0, 10)}T${time}:00`);
}

export default function AppointmentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { if (!authLoading && !user) router.push("/login"); }, [authLoading, user, router]);
  const load = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [appointmentResult, counsellorResult] = await Promise.all([user.role === "admin" ? getAllAppointments(1, 100) : getMyAppointments(), getCounsellors()]);
      setAppointments(appointmentResult.data || []); setCounsellors(counsellorResult.data || []); setError("");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to load appointments"); }
    finally { setLoading(false); }
  }, [user]);
  useEffect(() => { void load(); }, [load]);

  const names = useMemo(() => new Map(counsellors.map((item) => [item.id, item.fullName])), [counsellors]);
  const filtered = useMemo(() => appointments.filter((item) => !status || item.status === status), [appointments, status]);
  const events: AppointmentEvent[] = filtered.map((item) => ({ id: item.id, title: names.get(item.counsellorId) || "Counselling appointment", start: appointmentDate(item.date, item.startTime), end: appointmentDate(item.date, item.endTime), resource: item }));
  const upcoming = appointments.filter((item) => item.status !== "cancelled" && appointmentDate(item.date, item.startTime) >= new Date()).length;

  async function cancelCurrent() {
    if (!selected) return;
    const response = await cancelAppointment(selected.id, "Cancelled from appointment dashboard");
    if (!response.success) { setError(response.message); return; }
    setSelected(null); await load();
  }

  if (authLoading || loading) return <SkeletonCard/>;
  if (!user) return null;

  return <div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Appointments</h1><p className="mt-1 text-sm text-[#64748B]">Your real booking schedule.</p></div><Button className="w-full sm:w-auto" onClick={() => router.push("/counsellors")}><CalendarIcon className="h-4 w-4"/>Book appointment</Button></div>
    {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    <div className="grid gap-4 sm:grid-cols-3"><Card><p className="text-sm text-[#64748B]">Total</p><p className="mt-1 text-2xl font-bold">{appointments.length}</p></Card><Card><p className="text-sm text-[#64748B]">Upcoming</p><p className="mt-1 text-2xl font-bold text-[#2563EB]">{upcoming}</p></Card><Card><p className="text-sm text-[#64748B]">Completed</p><p className="mt-1 text-2xl font-bold text-[#22C55E]">{appointments.filter((item) => item.status === "completed").length}</p></Card></div>
    <Card><div className="flex flex-wrap items-center justify-between gap-3"><select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-xl border px-3 text-sm"><option value="">All statuses</option>{["scheduled", "confirmed", "completed", "cancelled", "no-show"].map((item) => <option key={item}>{item}</option>)}</select><div className="flex rounded-xl bg-[#F1F5F9] p-1"><button onClick={() => setView("calendar")} className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm ${view === "calendar" ? "bg-white shadow-sm" : "text-[#64748B]"}`}><CalendarIcon className="h-4 w-4"/>Calendar</button><button onClick={() => setView("list")} className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm ${view === "list" ? "bg-white shadow-sm" : "text-[#64748B]"}`}><List className="h-4 w-4"/>List</button></div></div></Card>
    {view === "calendar" ? <Card><div className="h-[620px]"><Calendar localizer={localizer} events={events} startAccessor="start" endAccessor="end" onSelectEvent={(event: AppointmentEvent) => setSelected(event.resource)} popup/></div></Card> : <Card padding="none"><div className="divide-y">{filtered.map((item) => <button key={item.id} onClick={() => setSelected(item)} className="flex w-full flex-wrap items-center justify-between gap-3 p-5 text-left hover:bg-[#F8FAFC]"><div><p className="font-semibold text-[#0F172A]">{names.get(item.counsellorId) || "Counselling appointment"}</p><p className="mt-1 text-sm text-[#64748B]">{new Date(item.date).toLocaleDateString()} · {item.startTime}–{item.endTime}</p></div><Badge variant={item.status === "completed" ? "success" : item.status === "cancelled" ? "default" : "info"}>{item.status}</Badge></button>)}{filtered.length === 0 && <p className="p-10 text-center text-sm text-[#64748B]">No appointments match this filter.</p>}</div></Card>}
    <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title="Appointment details"><div className="space-y-4">{selected && <><div><p className="font-semibold text-[#0F172A]">{names.get(selected.counsellorId) || "Counselling appointment"}</p><p className="text-sm text-[#64748B]">{new Date(selected.date).toLocaleDateString()}</p></div><div className="flex items-center gap-2 text-sm"><Clock className="h-4 w-4 text-[#2563EB]"/>{selected.startTime}–{selected.endTime}</div>{selected.notes && <p className="rounded-xl bg-[#F8FAFC] p-3 text-sm">{selected.notes}</p>}{selected.meetingLink && <a href={selected.meetingLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-[#2563EB]"><Video className="h-4 w-4"/>Join meeting</a>}<Badge variant={selected.status === "cancelled" ? "default" : "info"}>{selected.status}</Badge>{!['cancelled','completed'].includes(selected.status) && <Button variant="danger" className="w-full" onClick={cancelCurrent}><XCircle className="h-4 w-4"/>Cancel appointment</Button>}</>}</div></Modal>
  </div>;
}
