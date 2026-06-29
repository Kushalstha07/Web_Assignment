"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { StudentsTable } from "@/components/admin/StudentsTable";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { Student } from "@/components/admin/StudentsTable";

export default function StudentsPage() {
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

  // Mock data - replace with actual API calls
  const mockStudents: Student[] = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@example.com",
      university: "University of Toronto",
      country: "Canada",
      status: "active",
      progress: 85,
      counsellor: "Sarah Williams",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      university: "Stanford University",
      country: "USA",
      status: "active",
      progress: 72,
      counsellor: "Michael Brown",
    },
    {
      id: "3",
      name: "Michael Chen",
      email: "m.chen@example.com",
      university: "University of Melbourne",
      country: "Australia",
      status: "pending",
      progress: 45,
      counsellor: "Sarah Williams",
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.d@example.com",
      university: "MIT",
      country: "USA",
      status: "active",
      progress: 90,
      counsellor: "John Doe",
    },
    {
      id: "5",
      name: "James Wilson",
      email: "j.wilson@example.com",
      university: "University of British Columbia",
      country: "Canada",
      status: "inactive",
      progress: 30,
      counsellor: "Michael Brown",
    },
    {
      id: "6",
      name: "Lisa Anderson",
      email: "lisa.a@example.com",
      university: "Harvard University",
      country: "USA",
      status: "active",
      progress: 95,
      counsellor: "Sarah Williams",
    },
    {
      id: "7",
      name: "David Brown",
      email: "d.brown@example.com",
      university: "University of Toronto",
      country: "Canada",
      status: "pending",
      progress: 60,
      counsellor: "John Doe",
    },
    {
      id: "8",
      name: "Jennifer Taylor",
      email: "j.taylor@example.com",
      university: "Stanford University",
      country: "USA",
      status: "active",
      progress: 78,
      counsellor: "Michael Brown",
    },
    {
      id: "9",
      name: "Robert Martinez",
      email: "r.martinez@example.com",
      university: "University of Melbourne",
      country: "Australia",
      status: "active",
      progress: 88,
      counsellor: "Sarah Williams",
    },
    {
      id: "10",
      name: "Amanda White",
      email: "a.white@example.com",
      university: "MIT",
      country: "USA",
      status: "pending",
      progress: 52,
      counsellor: "John Doe",
    },
  ];

  const handleView = (student: Student) => {
    console.log("View student:", student);
    // Navigate to student detail page
    router.push(`/students/${student.id}`);
  };

  const handleEdit = (student: Student) => {
    console.log("Edit student:", student);
    // Open edit modal
  };

  const handleDelete = (student: Student) => {
    console.log("Delete student:", student);
    // Open delete confirmation modal
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0F172A]">Students</h1>
        <p className="mt-1 text-sm text-[#64748B]">Manage and track all student applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-[#64748B]">Total Students</p>
          <p className="mt-2 text-2xl font-bold text-[#0F172A]">2,847</p>
          <p className="mt-1 text-xs text-[#22C55E]">↑ 12.5% from last month</p>
        </div>
        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-[#64748B]">Active</p>
          <p className="mt-2 text-2xl font-bold text-[#0F172A]">2,156</p>
          <p className="mt-1 text-xs text-[#22C55E]">↑ 8.2% from last month</p>
        </div>
        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-[#64748B]">Pending</p>
          <p className="mt-2 text-2xl font-bold text-[#0F172A]">523</p>
          <p className="mt-1 text-xs text-[#F59E0B]">↓ 3.1% from last month</p>
        </div>
        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-[#64748B]">Inactive</p>
          <p className="mt-2 text-2xl font-bold text-[#0F172A]">168</p>
          <p className="mt-1 text-xs text-[#64748B]">No change</p>
        </div>
      </div>

      {/* Students Table */}
      <StudentsTable
        students={mockStudents}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}