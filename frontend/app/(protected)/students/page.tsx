"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { getUsers } from "@/lib/api/admin.api";
import type { AdminUser } from "@/lib/api/types";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { Search } from "lucide-react";

export default function StudentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Data states
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUsers(1, 100, search || undefined);
      if (response.success) {
        setUsers(response.data);
        setTotal(response.meta.total);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchUsers();
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
          <h1 className="text-3xl font-bold text-[#0F172A]">Students</h1>
          <p className="mt-1 text-sm text-[#64748B]">Loading...</p>
        </div>
        <SkeletonTable rows={8} columns={7} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const students = users.filter(u => u.role === "user");

  return (
    <AdminGuard>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">Students</h1>
          <p className="mt-1 text-sm text-[#64748B]">Manage and track all student applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#64748B]">Total Students</p>
            <p className="mt-2 text-2xl font-bold text-[#0F172A]">{total}</p>
            <p className="mt-1 text-xs text-[#64748B]">Registered users</p>
          </div>
          <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#64748B]">Active</p>
            <p className="mt-2 text-2xl font-bold text-[#0F172A]">{students.length}</p>
            <p className="mt-1 text-xs text-[#22C55E]">Student accounts</p>
          </div>
          <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#64748B]">Admins</p>
            <p className="mt-2 text-2xl font-bold text-[#0F172A]">{users.filter(u => u.role === "admin").length}</p>
            <p className="mt-1 text-xs text-[#64748B]">Admin accounts</p>
          </div>
          <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#64748B]">Total Users</p>
            <p className="mt-2 text-2xl font-bold text-[#0F172A]">{users.length}</p>
            <p className="mt-1 text-xs text-[#64748B]">Loaded in view</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="h-12 w-full max-w-md rounded-xl border border-[#E2E8F0] bg-white pl-11 pr-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15"
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
        ) : users.length === 0 ? (
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
              <table className="w-full">
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
                  {users.map((u) => (
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
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[#64748B]">{u.destination.charAt(0).toUpperCase() + u.destination.slice(1)}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[#64748B]">{u.studyLevel.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[#64748B]">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination info */}
            <div className="border-t border-[#E5E7EB] px-6 py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#64748B]">
                  Showing {users.length} of {total} users
                </p>
                <div className="flex gap-2">
                  <a
                    href="/admin/users"
                    className="rounded-[12px] bg-[#2563EB] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8] transition-all"
                  >
                    Manage All Users
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}