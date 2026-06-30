"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Search, Star, UserPlus } from "lucide-react";

interface Counsellor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  studentsAssigned: number;
  successRate: number;
  rating: number;
  status: "active" | "on_leave";
  avatar?: string;
}

export default function CounsellorsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [specialization, setSpecialization] = useState("all");

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

  const mockCounsellors: Counsellor[] = [
    { id: "1", name: "Sarah Williams", email: "sarah@eduglobal.com", specialization: "Study Visa", studentsAssigned: 45, successRate: 96, rating: 4.9, status: "active" },
    { id: "2", name: "Michael Brown", email: "michael@eduglobal.com", specialization: "PR", studentsAssigned: 38, successRate: 94, rating: 4.8, status: "active" },
    { id: "3", name: "Jennifer Taylor", email: "jennifer@eduglobal.com", specialization: "Language", studentsAssigned: 32, successRate: 92, rating: 4.7, status: "active" },
    { id: "4", name: "David Kim", email: "david@eduglobal.com", specialization: "Work Permit", studentsAssigned: 28, successRate: 90, rating: 4.5, status: "on_leave" },
    { id: "5", name: "Emily Chen", email: "emily@eduglobal.com", specialization: "Study Visa", studentsAssigned: 41, successRate: 95, rating: 4.8, status: "active" },
    { id: "6", name: "Raj Patel", email: "raj@eduglobal.com", specialization: "PR", studentsAssigned: 35, successRate: 93, rating: 4.6, status: "active" },
  ];

  const filteredCounsellors = mockCounsellors.filter((counsellor) => {
    const matchesSearch = counsellor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = specialization === "all" || counsellor.specialization === specialization;
    return matchesSearch && matchesFilter;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? "text-[#F59E0B] fill-current" : "text-[#E5E7EB]"}`} />
    ));
  };

  return (
    <AdminGuard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A]">Counsellors</h1>
            <p className="mt-1 text-sm text-[#64748B]">Manage and monitor counsellor performance</p>
          </div>
          <Button variant="primary" size="md">
            <UserPlus className="h-4 w-4" />
            Add Counsellor
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card padding="md">
            <p className="text-sm font-medium text-[#64748B]">Total Counsellors</p>
            <p className="mt-2 text-2xl font-bold text-[#0F172A]">6</p>
          </Card>
          <Card padding="md">
            <p className="text-sm font-medium text-[#64748B]">Active</p>
            <p className="mt-2 text-2xl font-bold text-[#22C55E]">5</p>
          </Card>
          <Card padding="md">
            <p className="text-sm font-medium text-[#64748B]">On Leave</p>
            <p className="mt-2 text-2xl font-bold text-[#F59E0B]">1</p>
          </Card>
          <Card padding="md">
            <p className="text-sm font-medium text-[#64748B]">New This Month</p>
            <p className="mt-2 text-2xl font-bold text-[#2563EB]">3</p>
          </Card>
        </div>

        <Card padding="md">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
              <Input
                placeholder="Search counsellors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="rounded-xl border border-[#E5E7EB] px-4 py-2 text-sm text-[#0F172A] focus:border-[#2563EB] focus:outline-none"
            >
              <option value="all">All Specializations</option>
              <option value="Study Visa">Study Visa</option>
              <option value="PR">PR</option>
              <option value="Language">Language</option>
              <option value="Work Permit">Work Permit</option>
            </select>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCounsellors.map((counsellor) => (
            <Card key={counsellor.id} padding="md" className="hover:shadow-md transition-all">
              <div className="flex items-start gap-4 mb-4">
                <Avatar src={counsellor.avatar} fallback={counsellor.name} size="lg" />
                <div className="flex-1">
                  <h3 className="text-base font-bold text-[#0F172A]">{counsellor.name}</h3>
                  <p className="text-xs text-[#64748B]">{counsellor.email}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(counsellor.rating)}
                    <span className="text-xs font-medium text-[#0F172A] ml-1">{counsellor.rating}</span>
                  </div>
                </div>
                <Badge variant={counsellor.status === "active" ? "success" : "warning"} size="sm">
                  {counsellor.status.replace("_", " ")}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-t border-[#E5E7EB]">
                  <span className="text-xs font-medium text-[#64748B]">Specialization</span>
                  <span className="text-xs font-semibold text-[#0F172A]">{counsellor.specialization}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#64748B]">Students Assigned</span>
                  <span className="text-xs font-semibold text-[#0F172A]">{counsellor.studentsAssigned}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#64748B]">Success Rate</span>
                  <span className="text-xs font-bold text-[#22C55E]">{counsellor.successRate}%</span>
                </div>

                <div className="flex gap-2 pt-3 border-t border-[#E5E7EB]">
                  <Button variant="ghost" size="sm" className="flex-1">View Profile</Button>
                  <Button variant="secondary" size="sm" className="flex-1">Assign Students</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminGuard>
  );
}