"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNav from "@/components/dashboard/TopNav";
import { cn } from "@/lib/utils";

export default function ProtectedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => { if (!loading && !user) router.push("/login"); }, [user, loading, router]);

  if (loading) return <div className="grid min-h-screen place-items-center bg-[#F7F9FC]"><div className="text-center"><div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-[#2563EB]"/><p className="mt-4 text-sm font-medium text-[#64748B]">Preparing your workspace…</p></div></div>;
  if (!user) return null;

  return <div className="min-h-screen bg-[#F7F9FC] text-[#0F172A]">
    {mobileOpen && <button aria-label="Close navigation overlay" onClick={closeMobile} className="fixed inset-0 z-40 bg-[#0F172A]/45 backdrop-blur-sm lg:hidden"/>}
    <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} onToggle={() => setCollapsed((value) => !value)} onClose={closeMobile}/>
    <div className={cn("min-h-screen transition-[margin] duration-300", collapsed ? "lg:ml-20" : "lg:ml-[280px]")}>
      <TopNav onOpenSidebar={() => setMobileOpen(true)}/>
      <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 xl:p-8">{children}</main>
    </div>
  </div>;
}
