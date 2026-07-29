"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, Mail, MapPin, Phone, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SkeletonCard } from "@/components/ui/Skeleton";

const pretty = (value?: string) => value ? value.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ") : "Not set";

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && !user) router.push("/login"); }, [loading, user, router]);
  if (loading) return <div className="grid gap-4 md:grid-cols-2">{[1,2].map((item) => <SkeletonCard key={item}/>)}</div>;
  if (!user) return null;

  return <div className="space-y-6">
    <div><h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Settings</h1><p className="mt-1 text-sm text-[#64748B]">Account details currently stored by the user service.</p></div>
    <div className="grid gap-4 xl:grid-cols-3">
      <Card className="xl:col-span-2"><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><div className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-2xl font-bold text-white">{user.fullName.split(" ").map((part) => part[0]).join("").slice(0,2).toUpperCase()}</div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-bold">{user.fullName}</h2><Badge variant={user.role === "admin" ? "purple" : user.role === "counsellor" ? "success" : "info"}>{user.role}</Badge></div><p className="mt-1 text-sm text-[#64748B]">@{user.username}</p></div><Button className="sm:ml-auto" onClick={() => router.push("/profile")}>Edit profile <ArrowRight className="h-4 w-4"/></Button></div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2"><Detail icon={Mail} label="Email" value={user.email}/><Detail icon={Phone} label="Phone" value={user.phoneNumber}/>{user.role === "student" ? <><Detail icon={MapPin} label="Preferred destination" value={pretty(user.destination)}/><Detail icon={User} label="Study level" value={pretty(user.studyLevel)}/></> : <Detail icon={User} label="Account role" value={pretty(user.role)}/>}</div>
      </Card>
      <Card><div className="grid h-12 w-12 place-items-center rounded-xl bg-[#EEF5FF]"><LockKeyhole className="h-6 w-6 text-[#2563EB]"/></div><h2 className="mt-4 font-bold">Account security</h2><p className="mt-2 text-sm leading-6 text-[#64748B]">Password changes are handled by the authenticated password endpoint.</p><Button variant="secondary" className="mt-6 w-full" onClick={() => router.push("/change-password")}>Change password</Button></Card>
    </div>
    <Card><h2 className="font-bold">Preference storage</h2><p className="mt-2 text-sm leading-6 text-[#64748B]">Notification channels, theme preferences, active sessions, and language preferences are not currently represented by backend fields. They are intentionally omitted here instead of showing unsaved or fabricated settings.</p></Card>
  </div>;
}

function Detail({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) { return <div className="flex items-center gap-3 rounded-xl border border-[#E7EDF6] p-4"><Icon className="h-5 w-5 shrink-0 text-[#2563EB]"/><div className="min-w-0"><p className="text-xs text-[#94A3B8]">{label}</p><p className="truncate text-sm font-semibold text-[#0F172A]">{value}</p></div></div>; }
