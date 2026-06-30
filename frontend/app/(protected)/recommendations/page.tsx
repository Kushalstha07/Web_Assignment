"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sparkles, TrendingUp, AlertTriangle, UserCheck, Lightbulb } from "lucide-react";

export default function RecommendationsPage() {
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

  return (
    <AdminGuard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A]">AI Recommendations</h1>
            <p className="mt-1 text-sm text-[#64748B]">Smart insights and action items for your consultancy</p>
          </div>
          <Button variant="primary" size="md">
            <Sparkles className="h-4 w-4" />
            Generate New Insights
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card padding="md">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F0FDF4]">
                <TrendingUp className="h-6 w-6 text-[#22C55E]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Student approval rate increased by 12% this week compared to last week</h3>
                <p className="mt-2 text-sm text-[#64748B]">Based on analysis of 245 applications processed in the last 7 days across all destinations.</p>
                <Button variant="ghost" size="sm" className="mt-3 !p-0 !h-auto text-[#2563EB] font-semibold">View Details</Button>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFF9EE]">
                <AlertTriangle className="h-6 w-6 text-[#F59E0B]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Visa delays detected for 3 students applying to UK universities</h3>
                <p className="mt-2 text-sm text-[#64748B]">Average processing time has increased from 15 to 23 days. Consider notifying affected students.</p>
                <Button variant="ghost" size="sm" className="mt-3 !p-0 !h-auto text-[#2563EB] font-semibold">View Details</Button>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF5FF]">
                <Lightbulb className="h-6 w-6 text-[#2563EB]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">UK applications growing by 18% - highest in 6 months</h3>
                <p className="mt-2 text-sm text-[#64748B]">Consider increasing capacity for UK university applications and allocating additional counsellors.</p>
                <Button variant="ghost" size="sm" className="mt-3 !p-0 !h-auto text-[#2563EB] font-semibold">View Details</Button>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100">
                <UserCheck className="h-6 w-6 text-[#7C3AED]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">AI recommends contacting 8 students with pending applications</h3>
                <p className="mt-2 text-sm text-[#64748B]">These students have had no updates in over 14 days and may need additional support.</p>
                <Button variant="ghost" size="sm" className="mt-3 !p-0 !h-auto text-[#2563EB] font-semibold">View Details</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AdminGuard>
  );
}