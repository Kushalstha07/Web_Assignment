"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function RoleGuard({
  children,
  roles,
}: {
  children: ReactNode;
  roles: string[];
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const allowed = Boolean(user && roles.includes(user.role));

  useEffect(() => {
    if (!loading && !allowed) router.push(user ? "/dashboard" : "/login");
  }, [allowed, loading, router, user]);

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#1565D8]" /></div>;
  }
  if (!allowed) return null;
  return <>{children}</>;
}
