"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 mx-auto" />
          <p className="mt-4 text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-lg font-semibold text-slate-900">
            Edu Global
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Profile
            </Link>
            <Link
              href="/change-password"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Change Password
            </Link>
            <span className="text-sm text-slate-400">|</span>
            <span className="text-sm text-slate-500">{user.fullName}</span>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
    </div>
  );
}