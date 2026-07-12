"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { useEffect } from "react";
import { BarChart3, TrendingUp, Download, FileText, Users, DollarSign, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ReportsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#1565D8]" />
      </div>
    );
  }

  if (!user) return null;

  const reports = [
    { title: "Monthly Applications Report", description: "Detailed breakdown of applications received, processed, and approved this month", icon: FileText, date: "Jun 1, 2025" },
    { title: "Student Conversion Funnel", description: "End-to-end funnel analysis from lead acquisition to enrollment", icon: TrendingUp, date: "May 28, 2025" },
    { title: "Counsellor Performance", description: "Individual and team performance metrics with comparison analytics", icon: Users, date: "May 25, 2025" },
    { title: "Revenue & Commission Report", description: "Financial summary including revenue, commission payouts, and projections", icon: DollarSign, date: "May 20, 2025" },
    { title: "Visa Success Rate Analysis", description: "Visa approval rates by country, university, and student profile", icon: CheckCircle, date: "May 15, 2025" },
    { title: "University Partnership Report", description: "Performance metrics for partner universities including application volume and acceptance rates", icon: BarChart3, date: "May 10, 2025" },
  ];

  return (
    <AdminGuard>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A]">Reports</h1>
            <p className="mt-1 text-sm text-[#64748B]">Generate and download comprehensive analytics reports</p>
          </div>
          <Button variant="primary" size="md" className="w-full sm:w-auto">
            <Download className="h-4 w-4" />
            Generate Report
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reports.map((report, idx) => {
            const Icon = report.icon;
            return (
              <Card key={idx} padding="md" className="group cursor-pointer hover-elevate">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF5FF]">
                    <Icon className="h-6 w-6 text-[#2563EB]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">{report.title}</h3>
                    <p className="mt-1 text-sm text-[#64748B] leading-relaxed">{report.description}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E5E7EB]">
                      <span className="text-xs text-[#94A3B8]">Updated: {report.date}</span>
                      <Button variant="ghost" size="sm" className="text-[#2563EB] !p-0 !h-auto font-semibold">
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </AdminGuard>
  );
}
