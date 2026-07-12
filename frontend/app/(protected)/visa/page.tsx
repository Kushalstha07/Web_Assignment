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
import { Search, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";

interface VisaApplication {
  id: string;
  student: string;
  university: string;
  visaType: string;
  currentStage: string;
  deadline: string;
  riskLevel: "low" | "medium" | "high";
}

export default function VisaPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");

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

  const mockApplications: VisaApplication[] = [
    { id: "1", student: "John Doe", university: "University of Toronto", visaType: "Study Permit", currentStage: "Documentation", deadline: "2025-08-15", riskLevel: "low" },
    { id: "2", student: "Emily Davis", university: "MIT", visaType: "F-1", currentStage: "Interview", deadline: "2025-08-10", riskLevel: "medium" },
    { id: "3", student: "Alex Johnson", university: "University of Melbourne", visaType: "Student Visa (Subclass 500)", currentStage: "Filing", deadline: "2025-08-20", riskLevel: "low" },
    { id: "4", student: "Sarah Lee", university: "Stanford University", visaType: "F-1", currentStage: "Approval", deadline: "2025-08-05", riskLevel: "high" },
    { id: "5", student: "Michael Chen", university: "UBC", visaType: "Study Permit", currentStage: "Stamping", deadline: "2025-07-30", riskLevel: "low" },
    { id: "6", student: "Lisa Wang", university: "Harvard University", visaType: "F-1", currentStage: "Documentation", deadline: "2025-08-25", riskLevel: "medium" },
  ];

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return <Badge variant="success" size="sm">Low Risk</Badge>;
      case "medium":
        return <Badge variant="warning" size="sm">Medium Risk</Badge>;
      case "high":
        return <Badge variant="danger" size="sm">High Risk</Badge>;
      default:
        return <Badge variant="default" size="sm">{risk}</Badge>;
    }
  };

  const filteredApplications = mockApplications.filter((app) => {
    const matchesSearch = app.student.toLowerCase().includes(searchQuery.toLowerCase()) || app.university.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = stageFilter === "all" || app.currentStage === stageFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminGuard>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">Visa Processing</h1>
          <p className="mt-1 text-sm text-[#64748B]">Track and manage student visa applications</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <Card padding="md">
            <p className="text-sm font-medium text-[#64748B]">Total</p>
            <p className="mt-2 text-2xl font-bold text-[#0F172A]">156</p>
          </Card>
          <Card padding="md">
            <p className="text-sm font-medium text-[#64748B]">In Progress</p>
            <p className="mt-2 text-2xl font-bold text-[#2563EB]">89</p>
          </Card>
          <Card padding="md">
            <p className="text-sm font-medium text-[#64748B]">Approved</p>
            <p className="mt-2 text-2xl font-bold text-[#22C55E]">45</p>
          </Card>
          <Card padding="md">
            <p className="text-sm font-medium text-[#64748B]">Rejected</p>
            <p className="mt-2 text-2xl font-bold text-[#EF4444]">12</p>
          </Card>
          <Card padding="md">
            <p className="text-sm font-medium text-[#64748B]">Pending Docs</p>
            <p className="mt-2 text-2xl font-bold text-[#F59E0B]">10</p>
          </Card>
        </div>

        <Card padding="md">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
              <Input
                placeholder="Search by student or university..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="rounded-xl border border-[#E5E7EB] px-4 py-2 text-sm text-[#0F172A] focus:border-[#2563EB] focus:outline-none"
            >
              <option value="all">All Stages</option>
              <option value="Documentation">Documentation</option>
              <option value="Filing">Filing</option>
              <option value="Interview">Interview</option>
              <option value="Approval">Approval</option>
              <option value="Stamping">Stamping</option>
            </select>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredApplications.map((app) => (
            <Card key={app.id} padding="md" className="hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">{app.student}</h3>
                  <p className="text-xs text-[#64748B]">{app.university}</p>
                </div>
                {getRiskBadge(app.riskLevel)}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-t border-[#E5E7EB]">
                  <span className="text-xs font-medium text-[#64748B]">Visa Type</span>
                  <span className="text-xs font-semibold text-[#0F172A]">{app.visaType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#64748B]">Current Stage</span>
                  <span className="text-xs font-semibold text-[#2563EB]">{app.currentStage}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#64748B]">Deadline</span>
                  <span className="text-xs font-semibold text-[#0F172A]">{app.deadline}</span>
                </div>

                <div className="flex gap-2 pt-3 border-t border-[#E5E7EB]">
                  <Button variant="ghost" size="sm" className="flex-1">View Details</Button>
                  <Button variant="secondary" size="sm" className="flex-1">Update Stage</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminGuard>
  );
}
