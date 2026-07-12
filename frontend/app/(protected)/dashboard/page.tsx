"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getUsers } from "@/lib/api/admin.api";
import type { AdminUser } from "@/lib/api/types";
import { getMyApplications, type Application } from "@/lib/api/application.api";
import { getScholarships, type Scholarship } from "@/lib/api/scholarship.api";
import { getUniversities, type University } from "@/lib/api/university.api";
import { Users, FileText, TrendingUp, Building2, Sparkles, AlertTriangle, UserCheck, FileCheck, GraduationCap, Calendar, ArrowRight, CheckCircle, Clock, Award } from "lucide-react";
import { KPICard } from "@/components/admin/KPICard";
import { AIInsights } from "@/components/admin/AIInsights";
import { SkeletonCard, SkeletonTable } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { SparklineData } from "@/components/charts";

function AdminDashboard() {
  // Fetch real user data
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUsers(1, 100);
      if (response.success) {
        setUsers(response.data);
        setTotalUsers(response.meta.total);
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
    fetchUsers();
  }, [fetchUsers]);

  // Calculate real metrics from user data
  const adminCount = users.filter(u => u.role === "admin").length;
  const userCount = totalUsers;

  const kpiData = [
    {
      title: "Total Users",
      value: loading ? "..." : userCount.toLocaleString(),
      trend: { value: 0, isPositive: true },
      sparklineData: [
        { value: 10 }, { value: 25 }, { value: 30 }, { value: 45 }, { value: 50 }, { value: 60 }, { value: Math.min(userCount, 100) }
      ] as SparklineData[],
      icon: Users,
      iconColor: "text-[#2563EB]",
      iconBg: "bg-[#EEF5FF]",
      comparison: "total registered users",
    },
    {
      title: "Admins",
      value: loading ? "..." : String(adminCount),
      trend: { value: 0, isPositive: true },
      sparklineData: [
        { value: 1 }, { value: 1 }, { value: 2 }, { value: 2 }, { value: 3 }, { value: adminCount }, { value: adminCount }
      ] as SparklineData[],
      icon: FileText,
      iconColor: "text-[#7C3AED]",
      iconBg: "bg-purple-100",
      comparison: "admin accounts",
    },
    {
      title: "Students",
      value: loading ? "..." : String(userCount - adminCount),
      trend: { value: 0, isPositive: true },
      sparklineData: [
        { value: 5 }, { value: 10 }, { value: 20 }, { value: 30 }, { value: 40 }, { value: 50 }, { value: Math.max(userCount - adminCount, 10) }
      ] as SparklineData[],
      icon: TrendingUp,
      iconColor: "text-[#22C55E]",
      iconBg: "bg-[#22C55E]/10",
      comparison: "student accounts",
    },
    {
      title: "Partner Universities",
      value: "156",
      trend: { value: 2.4, isPositive: true },
      sparklineData: [
        { value: 140 }, { value: 142 }, { value: 145 }, { value: 146 }, { value: 148 }, { value: 150 }, { value: 156 }
      ] as SparklineData[],
      icon: Building2,
      iconColor: "text-[#F59E0B]",
      iconBg: "bg-[#F59E0B]/10",
      comparison: "partner institutions",
    },
  ];

  const aiInsights = [
    {
      icon: TrendingUp,
      text: `System has ${userCount} registered users with ${adminCount} admin accounts`,
      type: "success" as const,
    },
    {
      icon: AlertTriangle,
      text: "User management is fully operational with CRUD capabilities",
      type: "info" as const,
    },
    {
      icon: Users,
      text: `Recent activity shows ${users.length} users loaded in current view`,
      type: "action" as const,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <SkeletonTable rows={5} columns={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          {error ? "Some data may not be available" : `Welcome back! ${userCount} users registered in the system.`}
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiData.map((kpi, idx) => (
          <KPICard key={idx} {...kpi} />
        ))}
      </div>

      {/* AI Insights Panel */}
      <AIInsights insights={aiInsights} onGenerateReport={() => alert("Generating report...")} />

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

      {/* Recent Activity & Quick Actions Grid */}
      <div className="grid gap-4 xl:grid-cols-2">
        {/* Recent Users */}
        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#0F172A]">Recent Users</h3>
            <a href="/admin/users" className="text-sm font-semibold text-[#2563EB] hover:underline">View All</a>
          </div>
          <div className="space-y-4">
            {users.length === 0 ? (
              <p className="text-sm text-[#64748B] text-center py-8">No users found</p>
            ) : (
              users.slice(0, 5).map((u) => (
                <div key={u.id} className="flex items-center justify-between rounded-xl border border-[#E5E7EB] p-3 transition-all hover:border-[#2563EB]/30 hover:bg-[#F8FAFC]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-sm font-bold text-white">
                      {u.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">{u.fullName}</p>
                      <p className="text-xs text-[#64748B]">{u.email}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold ${u.role === "admin" ? "text-[#7C3AED]" : "text-[#22C55E]"}`}>
                    {u.role}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-[#0F172A]">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Users, label: "Add User", color: "from-[#2563EB] to-[#7C3AED]", href: "/admin/users" },
              { icon: FileText, label: "Manage Users", color: "from-[#22C55E] to-[#10B981]", href: "/admin/users" },
              { icon: Building2, label: "View Students", color: "from-[#F59E0B] to-[#F97316]", href: "/students" },
              { icon: FileCheck, label: "Pipeline", color: "from-[#7C3AED] to-[#2563EB]", href: "/pipeline" },
            ].map((action, idx) => (
              <a
                key={idx}
                href={action.href}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] p-4 transition-all hover:-translate-y-0.5 hover:border-[#2563EB]/30 hover:shadow-md"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${action.color}`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-[#0F172A]">{action.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Users Overview */}
      <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#0F172A]">Users Overview</h3>
          <div className="flex gap-2">
            <span className="rounded-full bg-[#7C3AED]/10 px-3 py-1 text-xs font-semibold text-[#7C3AED]">Admins: {adminCount}</span>
            <span className="rounded-full bg-[#22C55E]/10 px-3 py-1 text-xs font-semibold text-[#22C55E]">Users: {userCount - adminCount}</span>
            <span className="rounded-full bg-[#2563EB]/10 px-3 py-1 text-xs font-semibold text-[#2563EB]">Total: {userCount}</span>
          </div>
        </div>
        <div className="rounded-xl bg-[#F8FAFC] p-6">
          {users.length > 0 ? (
            <div className="space-y-3">
              {users.slice(0, 8).map((u) => (
                <div key={u.id} className="flex items-center justify-between py-2 border-b border-[#E5E7EB] last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#94A3B8]">{u.id.slice(-8)}</span>
                    <span className="text-sm font-medium text-[#0F172A]">{u.fullName}</span>
                  </div>
                  <span className={`text-xs font-semibold ${u.role === "admin" ? "text-[#7C3AED]" : "text-[#2563EB]"}`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-[#64748B] py-8">No user data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StudentDashboard() {
  const { user } = useAuth();
  const [studentApplications, setStudentApplications] = useState<Application[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [studentLoading, setStudentLoading] = useState(true);

  useEffect(() => {
    void Promise.all([getMyApplications(), getUniversities({ limit: 100 }), getScholarships({ status: "active", limit: 10 })])
      .then(([applicationResult, universityResult, scholarshipResult]) => {
        setStudentApplications(applicationResult.data || []);
        setUniversities(universityResult.data || []);
        setScholarships(scholarshipResult.data || []);
      }).finally(() => setStudentLoading(false));
  }, []);

  const universityNames = new Map(universities.map((university) => [university.id, university.name]));
  const applications = studentApplications.map((application) => ({
    university: universityNames.get(application.universityId) || "University application",
    program: application.program,
    status: application.status,
    deadline: application.submittedDate ? `Submitted ${new Date(application.submittedDate).toLocaleDateString()}` : `Updated ${new Date(application.updatedAt).toLocaleDateString()}`,
  }));

  const upcomingTasks = scholarships.slice(0, 4).map((scholarship) => ({
    task: scholarship.name,
    due: scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : "Open deadline",
    completed: scholarship.status !== "active",
  }));

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0F172A]">
          Welcome back, {user?.fullName?.split(" ")[0] || "Student"}!
        </h1>
        <p className="mt-1 text-sm text-[#64748B]">Track your applications, documents, and upcoming deadlines.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF5FF]">
              <FileText className="h-6 w-6 text-[#2563EB]" />
            </div>
            <div>
              <p className="text-sm text-[#64748B]">Applications</p>
              <p className="text-2xl font-bold text-[#0F172A]">{studentLoading ? "…" : applications.length}</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0FDF4]">
              <CheckCircle className="h-6 w-6 text-[#22C55E]" />
            </div>
            <div>
              <p className="text-sm text-[#64748B]">Documents</p>
              <p className="text-2xl font-bold text-[#0F172A]">{studentApplications.filter((application) => application.stage === "verified").length}</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF9EE]">
              <Clock className="h-6 w-6 text-[#F59E0B]" />
            </div>
            <div>
              <p className="text-sm text-[#64748B]">Pending Tasks</p>
              <p className="text-2xl font-bold text-[#0F172A]">{upcomingTasks.filter(t => !t.completed).length}</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F6F0FF]">
              <Award className="h-6 w-6 text-[#7C3AED]" />
            </div>
            <div>
              <p className="text-sm text-[#64748B]">Scholarships</p>
              <p className="text-2xl font-bold text-[#0F172A]">{studentLoading ? "…" : scholarships.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid gap-4 xl:grid-cols-3">
        {/* Applications */}
        <Card padding="md" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#0F172A]">My Applications</h3>
            <Button variant="ghost" size="sm" className="text-[#2563EB]">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {applications.map((app, idx) => (
              <div key={idx} className="rounded-xl border border-[#E5E7EB] p-4 hover:border-[#2563EB]/30 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-[#0F172A]">{app.university}</h4>
                    <p className="text-sm text-[#64748B] mt-0.5">{app.program}</p>
                  </div>
                  <Badge variant={app.status === "accepted" ? "success" : app.status === "submitted" || app.status === "under-review" ? "warning" : "default"} size="sm">{app.status}</Badge>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E5E7EB]">
                  <span className="text-xs text-[#94A3B8]">Deadline: {app.deadline}</span>
                  <Button variant="ghost" size="sm" className="!p-0 !h-auto text-[#2563EB] font-semibold text-xs">
                    Continue <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
            {!studentLoading && applications.length === 0 && <p className="py-8 text-center text-sm text-[#64748B]">No applications yet. Browse universities to start one.</p>}
          </div>
        </Card>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Tasks */}
          <Card padding="md">
            <h3 className="text-lg font-bold text-[#0F172A] mb-4">To-Do List</h3>
            <div className="space-y-3">
            {upcomingTasks.map((task, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full mt-0.5 ${
                    task.completed ? "bg-[#22C55E]" : "border-2 border-[#D1D5DB]"
                  }`}>
                    {task.completed && <CheckCircle className="h-4 w-4 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${task.completed ? "text-[#94A3B8] line-through" : "text-[#0F172A] font-medium"}`}>
                      {task.task}
                    </p>
                    <p className="text-xs text-[#94A3B8]">Due: {task.due}</p>
                  </div>
                </div>
            ))}
            {!studentLoading && upcomingTasks.length === 0 && <p className="text-sm text-[#64748B]">No upcoming scholarship deadlines.</p>}
            </div>
          </Card>

          {/* Quick Links */}
          <Card padding="md">
            <h3 className="text-lg font-bold text-[#0F172A] mb-4">Quick Links</h3>
            <div className="space-y-2">
              {[
                { icon: GraduationCap, label: "Browse Universities", href: "/universities" },
                { icon: Award, label: "Scholarships", href: "/scholarships" },
                { icon: Calendar, label: "Book Appointment", href: "/appointments" },
                { icon: UserCheck, label: "My Profile", href: "/profile" },
              ].map((link, idx) => {
                const Icon = link.icon;
                return (
                  <a
                    key={idx}
                    href={link.href}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-all"
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                    <ArrowRight className="h-3 w-3 ml-auto" />
                  </a>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <SkeletonTable rows={5} columns={4} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Role-based dashboard rendering
  if (user.role === "admin") {
    return <AdminDashboard />;
  }

  return <StudentDashboard />;
}
