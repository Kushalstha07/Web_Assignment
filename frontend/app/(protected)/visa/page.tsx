"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Database, Plane } from "lucide-react";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";

export default function VisaPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && !user) router.push("/login"); }, [loading, user, router]);
  if (loading || !user) return null;

  return <AdminGuard><div className="space-y-6">
    <div><h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Visa Processing</h1><p className="mt-1 text-sm text-[#64748B]">Visa case management</p></div>
    <Card className="flex min-h-[420px] flex-col items-center justify-center text-center">
      <div className="relative"><div className="grid h-20 w-20 place-items-center rounded-3xl bg-[#EEF5FF]"><Plane className="h-9 w-9 text-[#2563EB]"/></div><span className="absolute -bottom-2 -right-2 grid h-9 w-9 place-items-center rounded-xl border-4 border-white bg-[#F8FAFC]"><Database className="h-4 w-4 text-[#64748B]"/></span></div>
      <h2 className="mt-7 text-xl font-bold text-[#0F172A]">No visa data source is configured</h2>
      <p className="mt-2 max-w-lg text-sm leading-6 text-[#64748B]">The backend currently has no visa model or API endpoint. This screen intentionally shows no cases or metrics so administrators are never presented with fabricated visa information.</p>
    </Card>
  </div></AdminGuard>;
}
