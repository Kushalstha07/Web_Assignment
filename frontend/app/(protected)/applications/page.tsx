"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { Search, Filter, Plus, Eye, FileText, Calendar, User } from "lucide-react";

interface Application {
  id: string;
  studentName: string;
  university: string;
  program: string;
  status: "pending" | "in_progress" | "approved" | "rejected" | "completed";
  submittedDate: string;
  deadline: string;
  counsellor: string;
  progress: number;
}

export default function ApplicationsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">Applications</h1>
          <p className="mt-1 text-sm text-[#64748B]">Loading...</p>
        </div>
        <SkeletonTable rows={6} columns={6} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const mockApplications: Application[] = [
    {
      id: "1",
      studentName: "John Smith",
      university: "University of Toronto",
      program: "MBA",
      status: "in_progress",
      submittedDate: "2025-01-15",
      deadline: "2025-03-01",
      counsellor: "Sarah Williams",
      progress: 65,
    },
    {
      id: "2",
      studentName: "Sarah Johnson",
      university: "Stanford University",
      program: "MS Computer Science",
      status: "approved",
      submittedDate: "2025-01-10",
      deadline: "2025-02-15",
      counsellor: "Michael Brown",
      progress: 100,
    },
    {
      id: "3",
      studentName: "Michael Chen",
      university: "University of Melbourne",
      program: "MS Data Science",
      status: "pending",
      submittedDate: "2025-01-20",
      deadline: "2025-04-01",
      counsellor: "Sarah Williams",
      progress: 30,
    },
    {
      id: "4",
      studentName: "Emily Davis",
      university: "MIT",
      program: "PhD AI",
      status: "in_progress",
      submittedDate: "2025-01-05",
      deadline: "2025-02-28",
      counsellor: "John Doe",
      progress: 80,
    },
    {
      id: "5",
      studentName: "James Wilson",
      university: "University of British Columbia",
      program: "MBA",
      status: "rejected",
      submittedDate: "2024-12-20",
      deadline: "2025-01-15",
      counsellor: "Michael Brown",
      progress: 100,
    },
    {
      id: "6",
      studentName: "Lisa Anderson",
      university: "Harvard University",
      program: "MBA",
      status: "completed",
      submittedDate: "2024-11-15",
      deadline: "2025-01-01",
      counsellor: "Sarah Williams",
      progress: 100,
    },
  ];

  const getStatusBadge = (status: Application["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "in_progress":
        return <Badge variant="info">In Progress</Badge>;
      case "approved":
        return <Badge variant="success">Approved</Badge>;
      case "rejected":
        return <Badge variant="danger">Rejected</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
    }
  };

  const getStatusCounts = () => {
    return {
      total: mockApplications.length,
      pending: mockApplications.filter(a => a.status === "pending").length,
      inProgress: mockApplications.filter(a => a.status === "in_progress").length,
      approved: mockApplications.filter(a => a.status === "approved" || a.status === "completed").length,
    };
  };

  const counts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">Applications</h1>
          <p className="mt-1 text-sm text-[#64748B]">Track and manage all student applications</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          New Application
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#64748B]">Total Applications</p>
              <p className="mt-2 text-2xl font-bold text-[#0F172A]">{counts.total}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF5FF]">
              <FileText className="h-6 w-6 text-[#2563EB]" />
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#64748B]">Pending</p>
              <p className="mt-2 text-2xl font-bold text-[#0F172A]">{counts.pending}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F59E0B]/10">
              <Calendar className="h-6 w-6 text-[#F59E0B]" />
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#64748B]">In Progress</p>
              <p className="mt-2 text-2xl font-bold text-[#0F172A]">{counts.inProgress}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
              <User className="h-6 w-6 text-[#7C3AED]" />
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#64748B]">Approved</p>
              <p className="mt-2 text-2xl font-bold text-[#0F172A]">{counts.approved}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#22C55E]/10">
              <Eye className="h-6 w-6 text-[#22C55E]" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card padding="md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
            <Input
              placeholder="Search by student name or university..."
              className="pl-10"
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <select className="h-11 flex-1 rounded-[12px] border border-[#E5E7EB] bg-white px-4 pr-10 text-sm text-[#0F172A] outline-none transition-all hover:border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15">
              <option>All Status</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
            <Button variant="secondary">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Applications Table */}
      <div className="rounded-[20px] border border-[#E5E7EB] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Student</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">University</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Program</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Deadline</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Counsellor</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#64748B]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {mockApplications.map((app) => (
                <tr key={app.id} className="transition-all hover:bg-[#F8FAFC]">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-sm font-bold text-white">
                        {app.studentName.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0F172A]">{app.studentName}</p>
                        <p className="text-xs text-[#64748B]">ID: {app.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm text-[#0F172A]">{app.university}</p>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm text-[#64748B]">{app.program}</p>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 rounded-full bg-[#E2E8F0]">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED]"
                          style={{ width: `${app.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-[#64748B]">{app.progress}%</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm text-[#64748B]">{app.deadline}</p>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm text-[#64748B]">{app.counsellor}</p>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="rounded-lg p-2 text-[#64748B] transition-all hover:bg-[#EEF5FF] hover:text-[#1565D8]" title="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg p-2 text-[#64748B] transition-all hover:bg-[#EEF5FF] hover:text-[#1565D8]" title="Edit">
                        <FileText className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-[#E5E7EB] px-6 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#64748B]">
              Showing {mockApplications.length} of {mockApplications.length} applications
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" disabled>
                Previous
              </Button>
              <Button variant="secondary" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
