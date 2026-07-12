"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getUsers, createUser, updateUser, deleteUser } from "@/lib/api/admin.api";
import type { AdminUser, PaginationMeta, AdminCreateUserPayload, AdminUpdateUserPayload } from "@/lib/api/types";
import { UserForm } from "@/components/admin/UserForm";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Data states
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & pagination
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const limit = 10;

  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check admin role
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUsers(page, limit, search || undefined);
      if (response.success) {
        setUsers(response.data);
        setMeta(response.meta);
      } else {
        setError(response.message || "Failed to fetch users");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchUsers(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchUsers]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Handlers
  async function handleSave(data: AdminCreateUserPayload | AdminUpdateUserPayload) {
    setIsSaving(true);
    try {
      if (editingUser) {
        const res = await updateUser(editingUser.id, data as AdminUpdateUserPayload);
        if (!res.success) throw new Error(res.message);
      } else {
        const res = await createUser(data as AdminCreateUserPayload);
        if (!res.success) throw new Error(res.message);
      }
      setShowForm(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to save user");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!deletingUser) return;
    setIsDeleting(true);
    try {
      const res = await deleteUser(deletingUser.id);
      if (!res.success) throw new Error(res.message);
      setDeletingUser(null);
      fetchUsers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  }

  function openCreateForm() {
    setEditingUser(null);
    setShowForm(true);
  }

  function openEditForm(user: AdminUser) {
    setEditingUser(user);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingUser(null);
  }

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#1565D8]" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">User Management</h1>
          <p className="mt-1 text-sm text-[#64748B]">Create accounts, assign roles, and manage access.</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1D4ED8] px-5 text-sm font-bold text-white shadow-lg shadow-[#1D4ED8]/20 transition-all hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add User
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E7EDF6] bg-white p-4 shadow-sm"><p className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Total accounts</p><p className="mt-2 text-2xl font-bold text-[#0F172A]">{meta?.total ?? users.length}</p></div>
        <div className="rounded-2xl border border-[#E7EDF6] bg-white p-4 shadow-sm"><p className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Admins on page</p><p className="mt-2 text-2xl font-bold text-[#7C3AED]">{users.filter((item) => item.role === "admin").length}</p></div>
        <div className="rounded-2xl border border-[#E7EDF6] bg-white p-4 shadow-sm"><p className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Students on page</p><p className="mt-2 text-2xl font-bold text-[#2563EB]">{users.filter((item) => item.role === "student").length}</p></div>
      </div>

      {/* Search */}
      <div className="relative rounded-2xl border border-[#E7EDF6] bg-white p-4 shadow-sm">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
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
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#1565D8]" />
        </div>
      ) : users.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#E2E8F0] bg-white">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <p className="mt-4 text-sm font-medium text-[#64748B]">No users found</p>
          {search && (
            <button
              onClick={() => { setSearchInput(""); setSearch(""); }}
              className="mt-2 text-sm text-[#1D4ED8] underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#E8EEF7] bg-white shadow-sm">
          <table className="min-w-[760px] w-full">
            <thead>
              <tr className="border-b border-[#E8EEF7] bg-[#F8FAFD]">
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B] xl:table-cell">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Created</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#64748B]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EEF7]">
              {users.map((u) => (
                <tr key={u.id} className="transition-all hover:bg-[#F8FAFD]">
                  <td className="hidden whitespace-nowrap px-4 py-3 text-xs font-mono text-[#64748B] xl:table-cell">{u.id.slice(-8)}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF5FF] text-xs font-bold text-[#1565D8]">
                        {u.fullName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-[#0F172A]">{u.fullName}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-[#64748B]">{u.email}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      u.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-[#64748B]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditForm(u)}
                        className="rounded-lg p-2 text-[#64748B] transition-all hover:bg-[#EEF5FF] hover:text-[#1565D8]"
                        title="Edit"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeletingUser(u)}
                        className="rounded-lg p-2 text-[#64748B] transition-all hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex min-w-[760px] items-center justify-between border-t border-[#E8EEF7] px-4 py-3">
              <p className="text-sm text-[#64748B]">
                Showing {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] transition-all hover:bg-[#F8FAFD] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    return p === 1 || p === meta.totalPages || Math.abs(p - page) <= 1;
                  })
                  .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && arr[idx - 1] !== p - 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, idx) =>
                    p === "..." ? (
                      <span key={`ellipsis-${idx}`} className="px-1 text-sm text-[#94A3B8]">...</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                          p === page
                            ? "bg-[#1D4ED8] text-white"
                            : "border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFD]"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                <button
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={page >= meta.totalPages}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] transition-all hover:bg-[#F8FAFD] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* User Form Modal */}
      {showForm && (
        <UserForm
          user={editingUser}
          onSave={handleSave}
          onCancel={closeForm}
          isSaving={isSaving}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingUser && (
        <DeleteConfirmModal
          user={deletingUser}
          onConfirm={handleDelete}
          onCancel={() => setDeletingUser(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
