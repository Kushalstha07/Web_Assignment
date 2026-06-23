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
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F7FB]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#2563EB]" />
          <p className="mt-4 text-sm text-[#64748B]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto flex h-20 max-w-[1320px] items-center justify-between px-8">
          {/* Left: Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" stroke="#2563EB" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="4" fill="#2563EB" />
              <path d="M2 12H22" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M12 2C15 5 16.5 8.5 16.5 12C16.5 15.5 15 19 12 22" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M12 2C9 5 7.5 8.5 7.5 12C7.5 15.5 9 19 12 22" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-xl font-bold text-[#1E293B]">EduGlobal</span>
          </Link>

          {/* Center: Search */}
          <div className="relative hidden md:block">
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search universities, scholarships..."
              className="h-11 w-[420px] rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] pl-11 pr-4 text-sm text-[#1E293B] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/10"
            />
          </div>

          {/* Right: Icons + Avatar */}
          <div className="flex items-center gap-3">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] transition-all hover:border-[#CBD5E1] hover:text-[#1E293B]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="currentColor"/>
              </svg>
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#EF4444] text-[9px] font-bold text-white">3</span>
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] transition-all hover:border-[#CBD5E1] hover:text-[#1E293B]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] transition-all hover:border-[#CBD5E1] hover:text-[#1E293B]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </button>
            <Link
              href="/profile"
              className="ml-2 flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white px-3 py-1.5 transition-all hover:border-[#2563EB]/30 hover:shadow-sm"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-sm font-bold text-white">
                {user.fullName
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-[#1E293B]">
                  {user.fullName}
                </p>
                <p className="text-xs text-[#64748B]">Student</p>
              </div>
            </Link>
            <button
              onClick={async () => {
                await logout();
                router.push("/login");
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              title="Logout"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[1320px] px-8 py-8">{children}</main>
    </div>
  );
}