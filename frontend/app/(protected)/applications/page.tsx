"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Clock3, ExternalLink, FileText, MessageSquare, Save, Search, Send, Trash2, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { Textarea } from "@/components/ui/Textarea";
import { getUsers } from "@/lib/api/admin.api";
import { deleteApplication, getAllApplications, getAssignedApplications, getMyApplications, submitApplication, updateApplication, type Application } from "@/lib/api/application.api";
import { getCounsellors, type Counsellor } from "@/lib/api/counsellor.api";
import { getStudentDocuments, type Document } from "@/lib/api/document.api";
import { createConversation, getConversations } from "@/lib/api/message.api";
import type { AdminUser } from "@/lib/api/types";
import { getUniversities, type University } from "@/lib/api/university.api";

const statuses = ["draft", "submitted", "under-review", "accepted", "rejected", "waitlisted", "withdrawn"];
const stages = ["documents-pending", "documents-uploaded", "verified", "interview-scheduled", "interview-completed", "decision-pending", "decision-made"];
const pretty = (value?: string) => value ? value.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ") : "Not set";

function statusVariant(status: string): "default" | "info" | "success" | "warning" | "danger" {
  if (status === "accepted") return "success";
  if (status === "rejected" || status === "withdrawn") return "danger";
  if (status === "submitted" || status === "under-review" || status === "waitlisted") return "warning";
  return "default";
}

export default function ApplicationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
  const [selected, setSelected] = useState<Application | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [studentDocuments, setStudentDocuments] = useState<Document[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [assignment, setAssignment] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { if (!authLoading && !user) router.push("/login"); }, [authLoading, user, router]);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const applicationRequest = user.role === "admin"
        ? getAllApplications(1, 100)
        : user.role === "counsellor"
          ? getAssignedApplications()
          : getMyApplications();
      const [applicationResult, universityResult, userResult, counsellorResult] = await Promise.all([
        applicationRequest,
        getUniversities({ limit: 100 }),
        user.role === "admin" ? getUsers(1, 100) : Promise.resolve(null),
        user.role === "admin" || user.role === "student" ? getCounsellors() : Promise.resolve(null),
      ]);
      setApplications(applicationResult.data || []);
      setUniversities(universityResult.data || []);
      setUsers(userResult?.data || []);
      setCounsellors(counsellorResult?.data || []);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load applications");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);

  const userNames = useMemo(() => new Map(users.map((item) => [item.id, item.fullName])), [users]);
  const universityNames = useMemo(() => new Map(universities.map((item) => [item.id, item.name])), [universities]);
  const counsellorNames = useMemo(() => new Map(counsellors.map((item) => [item.id, item.fullName])), [counsellors]);
  const canManageWorkflow = user?.role === "admin" || user?.role === "counsellor";

  const filtered = useMemo(() => applications.filter((item) => {
    const haystack = `${item.program} ${item.studentName || ""} ${userNames.get(item.studentId) || item.studentId} ${universityNames.get(item.universityId) || item.universityId} ${item.counsellorId ? counsellorNames.get(item.counsellorId) || item.counsellorId : "unassigned"}`.toLowerCase();
    const matchesAssignment = !assignment || (assignment === "assigned" ? Boolean(item.counsellorId) : !item.counsellorId);
    return haystack.includes(search.toLowerCase()) && (!status || item.status === status) && matchesAssignment;
  }), [applications, assignment, counsellorNames, search, status, userNames, universityNames]);

  function syncApplication(updated: Application) {
    setApplications((current) => current.map((item) => item.id === updated.id ? updated : item));
    setSelected((current) => current?.id === updated.id ? updated : current);
  }

  async function changeApplication(id: string, field: "status" | "stage", value: string) {
    try {
      setSavingId(id);
      const response = await updateApplication(id, { [field]: value });
      if (!response.success) throw new Error(response.message);
      syncApplication(response.data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to update application");
    } finally {
      setSavingId("");
    }
  }

  async function assignCounsellor(id: string, counsellorId: string) {
    try {
      setSavingId(id);
      const response = await updateApplication(id, { counsellorId: counsellorId || null });
      if (!response.success) throw new Error(response.message);
      syncApplication(response.data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to assign counsellor");
    } finally {
      setSavingId("");
    }
  }

  async function saveNotes() {
    if (!selected) return;
    try {
      setSavingId(selected.id);
      const response = await updateApplication(selected.id, { notes: notesDraft });
      if (!response.success) throw new Error(response.message);
      syncApplication(response.data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to save notes");
    } finally {
      setSavingId("");
    }
  }

  async function submitDraft(application: Application) {
    try {
      setSavingId(application.id);
      const response = await submitApplication(application.id, new Date().toISOString());
      if (!response.success) throw new Error(response.message);
      syncApplication(response.data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to submit application");
    } finally {
      setSavingId("");
    }
  }

  async function openConversation(application: Application) {
    if (!user) return;
    const universityName = universityNames.get(application.universityId) || "Application";
    let participantId = "";
    let title = `${universityName} · ${application.program}`;

    if (user.role === "student") {
      if (!application.counsellorId) {
        setError("A counsellor needs to be assigned before you can start this chat.");
        return;
      }
      const counsellor = counsellors.find((item) => item.id === application.counsellorId);
      if (!counsellor) {
        setError("Unable to find the assigned counsellor account. Try refreshing the page.");
        return;
      }
      participantId = counsellor.userId;
      title = `${counsellor.fullName} · ${application.program}`;
    } else if (user.role === "counsellor") {
      participantId = application.studentId;
      title = `${application.studentName || "Student"} · ${application.program}`;
    } else {
      setError("Only students and counsellors can start application chats here.");
      return;
    }

    try {
      setSavingId(application.id);
      const conversationResult = await getConversations();
      const existing = (conversationResult.data || []).find((conversation) =>
        conversation.participants.length === 2 &&
        conversation.participants.includes(user.id) &&
        conversation.participants.includes(participantId),
      );
      if (existing) {
        router.push(`/messages?conversation=${existing.id}`);
        return;
      }

      const created = await createConversation([participantId], title);
      router.push(`/messages?conversation=${created.data.id}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to open conversation");
    } finally {
      setSavingId("");
    }
  }

  async function removeApplication(application: Application) {
    if (!window.confirm(`Delete the ${application.program} application?`)) return;
    try {
      setSavingId(application.id);
      await deleteApplication(application.id);
      setApplications((current) => current.filter((item) => item.id !== application.id));
      setSelected(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to delete application");
    } finally {
      setSavingId("");
    }
  }

  async function openDetails(application: Application) {
    setSelected(application);
    setNotesDraft(application.notes || "");
    setStudentDocuments([]);
    if (user?.role !== "admin") {
      try {
        setDocumentsLoading(true);
        const response = await getStudentDocuments(application.studentId);
        setStudentDocuments(response.data || []);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Unable to load student documents");
      } finally {
        setDocumentsLoading(false);
      }
    }
  }

  if (authLoading || loading) return <div className="space-y-6"><SkeletonTable rows={7} columns={7}/></div>;
  if (!user) return null;

  const counts = {
    total: applications.length,
    submitted: applications.filter((item) => item.status === "submitted" || item.status === "under-review").length,
    accepted: applications.filter((item) => item.status === "accepted").length,
    rejected: applications.filter((item) => item.status === "rejected").length,
    unassigned: applications.filter((item) => !item.counsellorId).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Applications</h1>
          <p className="mt-1 text-sm text-[#64748B]">Track admissions, assign counsellors, and move cases through the pipeline.</p>
        </div>
        {user.role === "student" && <Button onClick={() => router.push("/universities")}>Start application</Button>}
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total" value={counts.total} icon={FileText} color="text-[#2563EB]" bg="bg-[#EEF5FF]"/>
        <Metric label="In review" value={counts.submitted} icon={Clock3} color="text-[#F59E0B]" bg="bg-[#FFF9EE]"/>
        <Metric label="Accepted" value={counts.accepted} icon={CheckCircle} color="text-[#22C55E]" bg="bg-[#F0FDF4]"/>
        <Metric label="Unassigned" value={counts.unassigned} icon={XCircle} color="text-[#EF4444]" bg="bg-red-50"/>
      </div>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"/>
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search student, university, or program" className="pl-10"/>
          </div>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 rounded-xl border border-[#DDE5EF] bg-white px-4 text-sm">
            <option value="">All statuses</option>
            {statuses.map((item) => <option key={item} value={item}>{pretty(item)}</option>)}
          </select>
          {user.role === "admin" && (
            <select value={assignment} onChange={(event) => setAssignment(event.target.value)} className="h-11 rounded-xl border border-[#DDE5EF] bg-white px-4 text-sm">
              <option value="">All assignments</option>
              <option value="unassigned">Unassigned only</option>
              <option value="assigned">Assigned only</option>
            </select>
          )}
        </div>
      </Card>

      <div className="overflow-x-auto rounded-[20px] border border-[#E7EDF6] bg-white shadow-sm">
        <table className="min-w-[1180px] w-full">
          <thead>
            <tr className="border-b bg-[#F8FAFC]">
              {["Student", "University", "Program", "Counsellor", "Status", "Stage", "Updated", "Actions"].map((heading) => (
                <th key={heading} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#64748B]">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7EDF6]">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-[#F8FAFC]">
                <td className="px-5 py-4"><p className="text-sm font-semibold text-[#0F172A]">{item.studentName || userNames.get(item.studentId) || (item.studentId === user.id ? user.fullName : "Unknown user")}</p><p className="text-xs text-[#94A3B8]">{item.studentId.slice(-8)}</p></td>
                <td className="px-5 py-4 text-sm text-[#0F172A]">{universityNames.get(item.universityId) || "Unknown university"}</td>
                <td className="px-5 py-4 text-sm text-[#64748B]">{item.program}</td>
                <td className="px-5 py-4">{user.role === "admin" ? <select disabled={savingId === item.id} value={item.counsellorId || ""} onChange={(event) => void assignCounsellor(item.id, event.target.value)} className="h-9 max-w-44 rounded-lg border px-2 text-xs"><option value="">Unassigned</option>{counsellors.map((counsellor) => <option key={counsellor.id} value={counsellor.id}>{counsellor.fullName}</option>)}</select> : <span className="text-sm text-[#64748B]">{item.counsellorId ? counsellorNames.get(item.counsellorId) || "Assigned" : "Unassigned"}</span>}</td>
                <td className="px-5 py-4">{canManageWorkflow ? <select disabled={savingId === item.id} value={item.status} onChange={(event) => void changeApplication(item.id, "status", event.target.value)} className="h-9 rounded-lg border px-2 text-xs">{statuses.map((value) => <option key={value} value={value}>{pretty(value)}</option>)}</select> : <Badge variant={statusVariant(item.status)}>{pretty(item.status)}</Badge>}</td>
                <td className="px-5 py-4">{canManageWorkflow ? <select disabled={savingId === item.id} value={item.stage} onChange={(event) => void changeApplication(item.id, "stage", event.target.value)} className="h-9 rounded-lg border px-2 text-xs">{stages.map((value) => <option key={value} value={value}>{pretty(value)}</option>)}</select> : <span className="text-sm text-[#64748B]">{pretty(item.stage)}</span>}</td>
                <td className="px-5 py-4 text-sm text-[#64748B]">{new Date(item.updatedAt).toLocaleDateString()}</td>
                <td className="px-5 py-4"><Button variant="ghost" size="sm" onClick={() => void openDetails(item)}><Send className="h-4 w-4"/>Details</Button></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={8} className="px-6 py-16 text-center text-sm text-[#64748B]">No application records match this view.</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title="Application Details" size="lg">
        {selected && (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <Detail label="Student" value={selected.studentName || userNames.get(selected.studentId) || (selected.studentId === user.id ? user.fullName : selected.studentId)} />
              <Detail label="University" value={universityNames.get(selected.universityId) || selected.universityId} />
              <Detail label="Program" value={selected.program} />
              <Detail label="Counsellor" value={selected.counsellorId ? counsellorNames.get(selected.counsellorId) || selected.counsellorId : "Unassigned"} />
              <Detail label="Status" value={pretty(selected.status)} />
              <Detail label="Stage" value={pretty(selected.stage)} />
              <Detail label="Submitted" value={selected.submittedDate || "Not submitted"} />
              <Detail label="Decision" value={selected.decisionDate || "Pending"} />
            </div>

            <Textarea label="Case Notes" value={notesDraft} onChange={(event) => setNotesDraft(event.target.value)} maxLength={1000} placeholder="Add internal case notes, student context, or follow-up items." />

            {user.role !== "admin" && (
              <div className="rounded-xl border border-[#E7EDF6] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#0F172A]">Student Documents</h3>
                  <span className="text-xs text-[#94A3B8]">{studentDocuments.length} files</span>
                </div>
                {documentsLoading && <p className="text-sm text-[#64748B]">Loading documents...</p>}
                {!documentsLoading && studentDocuments.length === 0 && (
                  <p className="text-sm text-[#64748B]">No documents have been uploaded for this student yet.</p>
                )}
                <div className="space-y-2">
                  {studentDocuments.map((document) => (
                    <div key={document.id} className="flex flex-col gap-3 rounded-xl bg-[#F8FAFC] p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#0F172A]">{document.originalName}</p>
                        <p className="text-xs text-[#64748B]">{pretty(document.category)} · {pretty(document.status)} · {formatSize(document.size)}</p>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => window.open(document.url, "_blank", "noopener,noreferrer")}>
                        <ExternalLink className="h-4 w-4" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              {(user.role === "admin" || selected.studentId === user.id) && (
                <Button type="button" variant="danger" onClick={() => void removeApplication(selected)} loading={savingId === selected.id}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              )}
              {user.role === "student" && selected.studentId === user.id && selected.status === "draft" && (
                <Button type="button" onClick={() => void submitDraft(selected)} loading={savingId === selected.id}>
                  <Send className="h-4 w-4" />
                  Submit Application
                </Button>
              )}
              {((user.role === "student" && selected.studentId === user.id && selected.counsellorId) || user.role === "counsellor") && (
                <Button type="button" variant="secondary" onClick={() => void openConversation(selected)} loading={savingId === selected.id}>
                  <MessageSquare className="h-4 w-4" />
                  Message
                </Button>
              )}
              <Button type="button" onClick={() => void saveNotes()} loading={savingId === selected.id}>
                <Save className="h-4 w-4" />
                Save Notes
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Metric({ label, value, icon: Icon, color, bg }: { label: string; value: number; icon: React.ElementType; color: string; bg: string }) {
  return <Card><div className="flex items-center justify-between"><div><p className="text-sm text-[#64748B]">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div><div className={`rounded-xl p-3 ${bg}`}><Icon className={`h-5 w-5 ${color}`}/></div></div></Card>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-[#E7EDF6] p-3"><p className="text-xs text-[#94A3B8]">{label}</p><p className="mt-1 text-sm font-semibold text-[#0F172A]">{value}</p></div>;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
