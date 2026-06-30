"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { getUsers } from "@/lib/api/admin.api";
import type { AdminUser } from "@/lib/api/types";
import { StudentPipeline } from "@/components/admin/StudentPipeline";
import { SkeletonCard } from "@/components/ui/Skeleton";
import type { Student } from "@/components/admin/StudentPipeline";

export default function PipelinePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUsers(1, 100);
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
  }, []);

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
          <h1 className="text-3xl font-bold text-[#0F172A]">Student Pipeline</h1>
          <p className="mt-1 text-sm text-[#64748B]">Loading...</p>
        </div>
        <SkeletonCard />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Map real users to pipeline students
  const pipelineStudents: Student[] = users.map((u, idx) => {
    const stages = ["Lead", "Consultation", "Application", "Offer Letter", "Visa", "Enrolled"] as const;
    return {
      id: u.id,
      name: u.fullName,
      email: u.email,
      phone: u.phoneNumber,
      university: `${u.destination.charAt(0).toUpperCase() + u.destination.slice(1)} - ${u.fieldOfStudy}`,
      program: u.studyLevel.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      stage: stages[idx % stages.length],
    };
  });

  return (
    <AdminGuard>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">Student Pipeline</h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Track and manage student applications through all stages
          </p>
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

        {loading ? (
          <SkeletonCard />
        ) : pipelineStudents.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#E2E8F0] bg-white">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
            <p className="mt-4 text-sm font-medium text-[#64748B]">No students in pipeline</p>
            <p className="text-xs text-[#94A3B8] mt-1">Create users to see them in the pipeline</p>
          </div>
        ) : (
          <StudentPipeline students={pipelineStudents} />
        )}

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-[#64748B]">Total in Pipeline</h3>
            <p className="mt-2 text-2xl font-bold text-[#0F172A]">{pipelineStudents.length}</p>
            <p className="mt-1 text-xs text-[#64748B]">Active students in system</p>
          </div>
          <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-[#64748B]">Total Users</h3>
            <p className="mt-2 text-2xl font-bold text-[#0F172A]">{total}</p>
            <p className="mt-1 text-xs text-[#64748B]">Registered users</p>
          </div>
          <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-[#64748B]">Admins</h3>
            <p className="mt-2 text-2xl font-bold text-[#0F172A]">{users.filter(u => u.role === "admin").length}</p>
            <p className="mt-1 text-xs text-[#64748B]">Admin accounts</p>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}