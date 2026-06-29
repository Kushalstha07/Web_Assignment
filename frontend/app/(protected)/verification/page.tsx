"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Search, Eye, CheckCircle, XCircle, FileText, AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationItem {
  id: string;
  student: string;
  documentType: string;
  uploadDate: string;
  aiConfidence: number;
  ocrProgress: number;
  status: "pending" | "verified" | "rejected" | "needs_attention";
  missingPages: boolean;
  fraudDetected: boolean;
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

  const mockItems: VerificationItem[] = [
    { id: "1", student: "John Doe", documentType: "Passport", uploadDate: "2025-07-28", aiConfidence: 96, ocrProgress: 100, status: "pending", missingPages: false, fraudDetected: false },
    { id: "2", student: "Emily Davis", documentType: "IELTS Certificate", uploadDate: "2025-07-27", aiConfidence: 88, ocrProgress: 85, status: "needs_attention", missingPages: true, fraudDetected: false },
    { id: "3", student: "Alex Johnson", documentType: "Bank Statement", uploadDate: "2025-07-26", aiConfidence: 72, ocrProgress: 90, status: "rejected", missingPages: false, fraudDetected: true },
    { id: "4", student: "Sarah Lee", documentType: "University Offer Letter", uploadDate: "2025-07-25", aiConfidence: 99, ocrProgress: 100, status: "verified", missingPages: false, fraudDetected: false },
    { id: "5", student: "Michael Chen", documentType: "Transcript", uploadDate: "2025-07-24", aiConfidence: 91, ocrProgress: 100, status: "verified", missingPages: false, fraudDetected: false },
    { id: "6", student: "Lisa Wang", documentType: "Visa Application", uploadDate: "2025-07-23", aiConfidence: 65, ocrProgress: 70, status: "needs_attention", missingPages: true, fraudDetected: false },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge variant="success" size="sm">Verified</Badge>;
      case "pending":
        return <Badge variant="warning" size="sm">Pending Review</Badge>;
      case "rejected":
        return <Badge variant="danger" size="sm">Rejected</Badge>;
      case "needs_attention":
        return <Badge variant="info" size="sm">Needs Attention</Badge>;
      default:
        return <Badge variant="info" size="sm">{status}</Badge>;
    }
  };

  const filteredItems = mockItems.filter((item) => {
    const matchesSearch = item.student.toLowerCase().includes(searchQuery.toLowerCase()) || item.documentType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0F172A]">Document Verification</h1>
        <p className="mt-1 text-sm text-[#64748B]">AI-assisted document verification queue</p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card padding="md">
          <p className="text-sm font-medium text-[#64748B]">Pending Review</p>
          <p className="mt-2 text-2xl font-bold text-[#F59E0B]">12</p>
        </Card>
        <Card padding="md">
          <p className="text-sm font-medium text-[#64748B]">Verified Today</p>
          <p className="mt-2 text-2xl font-bold text-[#22C55E]">28</p>
        </ Card>
        <Card padding="md">
          <p className="text-sm font-medium text-[#64748B]">Needs Attention</p>
          <p className="mt-2 text-2xl font-bold text-[#2563EB]">5</p>
        </Card>
        <Card padding="md">
          <p className="text-sm font-medium text-[#64748B]">Rejected</p>
          <p className="mt-2 text-2xl font-bold text-[#EF4444]">3</p>
        </Card>
      </div>

      {/* Filters */}
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
            <option value="needs_attention">Needs Attention</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </Card>

      {/* Verification Queue */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item.id} padding="md" className="hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8FAFC]">
                  <FileText className="h-5 w-5 text-[#64748B]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0F172A]">{item.student}</p>
                  <p className="text-xs text-[#64748B]">{item.documentType}</p>
                </div>
              </div>
              {getStatusBadge(item.status)}
            </div>

            <div className="space-y-3">
              {/* AI Confidence */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-[#64748B]">AI Confidence</span>
                  <span className={cn(
                    "text-xs font-bold",
                    item.aiConfidence >= 90 ? "text-[#22C55E]" :
                    item.aiConfidence >= 70 ? "text-[#F59E0B]" : "text-[#EF4444]"
                  )}>
                    {item.aiConfidence}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#E5E7EB]">
                  <div
                    className={cn(
                      "h-2 rounded-full",
                      item.aiConfidence >= 90 ? "bg-[#22C55E]" :
                      item.aiConfidence >= 70 ? "bg-[#F59E0B]" : "bg-[#EF4444]"
                    )}
                    style={{ width: `${item.aiConfidence}%` }}
                  />
                </div>
              </div>

              {/* OCR Progress */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-[#64748B]">OCR Completion</span>
                  <span className="text-xs font-bold text-[#0F172A]">{item.ocrProgress}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#E5E7EB]">
                  <div
                    className="h-2 rounded-full bg-[#2563EB]"
                    style={{ width: `${item.ocrProgress}%` }}
                  />
                </div>
              </div>

              {/* Warnings */}
              <div className="flex flex-wrap gap-2">
                {item.missingPages && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-[#F59E0B]">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Missing Pages
                  </span>
                )}
                {item.fraudDetected && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-[#EF4444] bg-[#FEF2F2] px-2 py-1 rounded-full">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Fraud Detected
                  </span>
                )}
              </div>

              {/* Upload Date */}
              <p className="text-xs text-[#94A3B8]">Uploaded on {item.uploadDate}</p>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-[#E5E7EB]">
                <Button variant="ghost" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button variant="secondary" size="sm" className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button variant="danger" size="sm" className="flex-1">
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}