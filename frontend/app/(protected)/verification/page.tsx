"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Search, FileCheck, CheckCircle, Clock, XCircle, AlertTriangle } from "lucide-react";

interface VerificationDoc {
  id: string;
  student: string;
  documentType: string;
  submittedDate: string;
  status: "pending" | "verified" | "rejected";
  fileSize: string;
}

export default function VerificationPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading || !mounted) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
      </div>
    );
  }

  if (!user) return null;

  const mockDocs: VerificationDoc[] = [
    { id: "1", student: "John Doe", documentType: "Academic Transcript", submittedDate: "2025-06-28", status: "pending", fileSize: "2.4 MB" },
    { id: "2", student: "Emily Davis", documentType: "Passport Copy", submittedDate: "2025-06-27", status: "verified", fileSize: "1.1 MB" },
    { id: "3", student: "Alex Johnson", documentType: "Statement of Purpose", submittedDate: "2025-06-26", status: "pending", fileSize: "0.8 MB" },
    { id: "4", student: "Sarah Lee", documentType: "Recommendation Letter", submittedDate: "2025-06-25", status: "rejected", fileSize: "1.5 MB" },
    { id: "5", student: "Michael Chen", documentType: "Financial Statement", submittedDate: "2025-06-24", status: "verified", fileSize: "3.2 MB" },
    { id: "6", student: "Lisa Wang", documentType: "Language Test Score", submittedDate: "2025-06-23", status: "pending", fileSize: "0.5 MB" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge variant="success" size="sm">Verified</Badge>;
      case "pending":
        return <Badge variant="warning" size="sm">Pending</Badge>;
      case "rejected":
        return <Badge variant="danger" size="sm">Rejected</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  const filteredDocs = mockDocs.filter((doc) => {
    const matchesSearch = doc.student.toLowerCase().includes(searchQuery.toLowerCase()) || doc.documentType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === "all" || doc.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminGuard>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">Document Verification</h1>
          <p className="mt-1 text-sm text-[#64748B]">Review and verify student documents</p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF5FF]">
                <FileCheck className="h-6 w-6 text-[#2563EB]" />
              </div>
              <div>
                <p className="text-sm text-[#64748B]">Total</p>
                <p className="text-2xl font-bold text-[#0F172A]">156</p>
              </div>
            </div>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0FDF4]">
                <CheckCircle className="h-6 w-6 text-[#22C55E]" />
              </div>
              <div>
                <p className="text-sm text-[#64748B]">Verified</p>
                <p className="text-2xl font-bold text-[#0F172A]">89</p>
              </div>
            </div>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF9EE]">
                <Clock className="h-6 w-6 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-sm text-[#64748B]">Pending</p>
                <p className="text-2xl font-bold text-[#0F172A]">45</p>
              </div>
            </div>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FEF2F2]">
                <XCircle className="h-6 w-6 text-[#EF4444]" />
              </div>
              <div>
                <p className="text-sm text-[#64748B]">Rejected</p>
                <p className="text-2xl font-bold text-[#0F172A]">22</p>
              </div>
            </div>
          </Card>
        </div>

        <Card padding="md">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
              <Input
                placeholder="Search by student or document type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-[#E5E7EB] px-4 py-2 text-sm text-[#0F172A] focus:border-[#2563EB] focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </Card>

        <div className="overflow-hidden rounded-2xl border border-[#E8EEF7] bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8EEF7] bg-[#F8FAFD]">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Student</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Document</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Submitted</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Size</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#64748B]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EEF7]">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#F8FAFD] transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-[#0F172A]">{doc.student}</td>
                  <td className="px-4 py-3 text-sm text-[#64748B]">{doc.documentType}</td>
                  <td className="px-4 py-3 text-sm text-[#64748B]">{doc.submittedDate}</td>
                  <td className="px-4 py-3 text-sm text-[#64748B]">{doc.fileSize}</td>
                  <td className="px-4 py-3">{getStatusBadge(doc.status)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">View</Button>
                      {doc.status === "pending" && (
                        <>
                          <Button variant="ghost" size="sm" className="text-[#22C55E]">Approve</Button>
                          <Button variant="ghost" size="sm" className="text-[#EF4444]">Reject</Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminGuard>
  );
}