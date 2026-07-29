"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { getUsers } from "@/lib/api/admin.api";
import { getAssignedStudents } from "@/lib/api/counsellor.api";
import type { AdminUser } from "@/lib/api/types";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { Search } from "lucide-react";

export default function StudentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Data states
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (!user) return;
      const response = user.role === "counsellor"
        ? await getAssignedStudents(search || undefined)
        : await getUsers(1, 100, search || undefined);
      if (response.success) {
        setUsers(response.data);
      } else {
        setError(response.message);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [search, user]);

  useEffect(() => {
    if (!authLoading && user) {
      const timer = window.setTimeout(() => void fetchUsers(), 0);
      return () => window.clearTimeout(timer);
    }
  }, [fetchUsers, authLoading, user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Students</h1>
          <p className="mt-1 text-sm text-[#64748B]">Loading...</p>
        </div>
        <SkeletonTable rows={8} columns={7} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const students = users.filter(u => u.role === "student");

  return (
    <RoleGuard roles={["admin", "counsellor"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">Students</h1>
          <p className="mt-1 text-sm text-[#64748B]">{user.role === "counsellor" ? "Students assigned through your application cases" : "Manage and track all student applications"}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#64748B]">Total Students</p>
            <p className="mt-2 text-2xl font-bold text-[#0F172A]">{students.length}</p>
            <p className="mt-1 text-xs text-[#64748B]">Student accounts loaded</p>
          </div>
          <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#64748B]">Active</p>
            <p className="mt-2 text-2xl font-bold text-[#0F172A]">{students.length}</p>
            <p className="mt-1 text-xs text-[#22C55E]">Student accounts</p>
          </div>
          <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#64748B]">Destinations</p>
            <p className="mt-2 text-2xl font-bold text-[#0F172A]">{new Set(students.map((student) => student.destination)).size}</p>
            <p className="mt-1 text-xs text-[#64748B]">Represented in this view</p>
          </div>
          <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#64748B]">Study Fields</p>
            <p className="mt-2 text-2xl font-bold text-[#0F172A]">{new Set(students.map((student) => student.fieldOfStudy)).size}</p>
            <p className="mt-1 text-xs text-[#64748B]">Represented in this view</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative rounded-2xl border border-[#E7EDF6] bg-white p-4 shadow-sm">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-11 pr-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:bg-white focus:ring-2 focus:ring-[#1D4ED8]/15 sm:max-w-lg"
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4">
            <div className="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div>
                <p className="text-sm font-medium text-red-800">{error}</p>
                <button onClick={fetchUsers} className="text-sm text-red-600 underline hover:text-red-800">
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        {loading ? (
          <SkeletonTable rows={8} columns={7} />
        ) : students.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#E2E8F0] bg-white">
            <Search className="h-12 w-12 text-[#94A3B8] mb-3" />
            <p className="text-sm font-medium text-[#64748B]">No users found</p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-2 text-sm text-[#1D4ED8] underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="rounded-[20px] border border-[#E5E7EB] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Destination</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Study Level</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {students.map((u) => (
                    <tr key={u.id} className="transition-all hover:bg-[#F8FAFC]">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-xs font-bold text-white">
                            {u.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#0F172A]">{u.fullName}</p>
                            <p className="text-xs text-[#64748B]">@{u.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[#64748B]">{u.email}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          u.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : u.role === "counsellor"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[#64748B]">{u.destination ? u.destination.charAt(0).toUpperCase() + u.destination.slice(1) : "Not set"}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[#64748B]">{u.studyLevel ? u.studyLevel.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Not set"}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[#64748B]">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination info */}
            <div className="border-t border-[#E5E7EB] px-6 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[#64748B]">
                  Showing {students.length} student accounts
                </p>
                {user.role === "admin" && <div className="flex gap-2">
                  <a
                    href="/admin/users"
                    className="rounded-[12px] bg-[#2563EB] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8] transition-all"
                  >
                    Manage All Users
                  </a>
                </div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
