"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { Search, Filter, MoreVertical, Eye, Edit, Trash2 } from "lucide-react";

export interface Student {
  id: string;
  name: string;
  email: string;
  university: string;
  country: string;
  status: "active" | "pending" | "inactive";
  progress: number;
  counsellor: string;
  avatar?: string;
}

interface StudentsTableProps {
  students: Student[];
  onView?: (student: Student) => void;
  onEdit?: (student: Student) => void;
  onDelete?: (student: Student) => void;
}

export function StudentsTable({ students, onView, onEdit, onDelete }: StudentsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.university.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || student.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Student["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "inactive":
        return <Badge variant="default">Inactive</Badge>;
    }
  };

  return (
    <div className="rounded-[20px] border border-[#E5E7EB] bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-[#E5E7EB] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#0F172A]">Recent Students</h2>
            <p className="mt-1 text-sm text-[#64748B]">Manage and track all student applications</p>
          </div>
          <Button>
            <Eye className="h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
            <Input
              placeholder="Search by name, email, or university..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-11 rounded-[12px] border border-[#E5E7EB] bg-white px-4 pr-10 text-sm text-[#0F172A] outline-none transition-all hover:border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
            <Filter className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Student</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">University</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Country</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Progress</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Counsellor</th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#64748B]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="h-12 w-12 text-[#94A3B8] mb-3" />
                    <p className="text-sm font-medium text-[#64748B]">No students found</p>
                    <p className="text-xs text-[#94A3B8] mt-1">Try adjusting your search or filter criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id} className="transition-all hover:bg-[#F8FAFC]">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={student.avatar} fallback={student.name} size="sm" />
                      <div>
                        <p className="text-sm font-semibold text-[#0F172A]">{student.name}</p>
                        <p className="text-xs text-[#64748B]">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm text-[#0F172A]">{student.university}</p>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm text-[#64748B]">{student.country}</p>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {getStatusBadge(student.status)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 rounded-full bg-[#E2E8F0]">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED]"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-[#64748B]">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm text-[#64748B]">{student.counsellor}</p>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onView?.(student)}
                        className="rounded-lg p-2 text-[#64748B] transition-all hover:bg-[#EEF5FF] hover:text-[#1565D8]"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit?.(student)}
                        className="rounded-lg p-2 text-[#64748B] transition-all hover:bg-[#EEF5FF] hover:text-[#1565D8]"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete?.(student)}
                        className="rounded-lg p-2 text-[#64748B] transition-all hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="border-t border-[#E5E7EB] px-6 py-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#64748B]">
            Showing {filteredStudents.length} of {students.length} students
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
  );
}