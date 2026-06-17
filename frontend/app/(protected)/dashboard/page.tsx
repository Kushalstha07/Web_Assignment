"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#2563EB]" />
          <p className="mt-4 text-sm text-[#64748B]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] p-8 text-white">
        <div className="relative z-10 flex items-center justify-between">
          <div className="max-w-xl">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {user.fullName.split(" ")[0]}!
            </h1>
            <p className="mt-2 text-lg text-blue-100">
              Your application journey is 75% complete. Stay on track for the
              Fall '25 intake.
            </p>
            <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#2563EB] shadow-sm transition-all hover:shadow-md">
              Continue Application
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {/* Profile Progress */}
            <div className="mt-6 flex items-center gap-3">
              <div className="h-2 w-48 rounded-full bg-white/20">
                <div className="h-2 w-[75%] rounded-full bg-white" />
              </div>
              <span className="text-sm font-medium text-blue-100">
                Profile Completion 75%
              </span>
            </div>
          </div>
          {/* Illustration area */}
          <div className="hidden lg:block">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
              <span className="text-5xl">🎓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid: Sidebar + Content */}
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* LEFT SIDEBAR */}
        <div className="space-y-6">
          {/* Profile Completion Card */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-[#1E293B]">
              Profile Completion
            </h3>
            <div className="mt-4">
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-[#2563EB]">75%</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-[#E2E8F0]">
                <div className="h-2 w-[75%] rounded-full bg-[#2563EB]" />
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {[
                { label: "Personal Details", done: true },
                { label: "Transcripts", done: true },
                { label: "Statement of Purpose", done: false },
                { label: "Recommendations", done: false },
                { label: "Financial Documents", done: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full ${
                      item.done
                        ? "bg-[#22C55E] text-white"
                        : "border-2 border-[#CBD5E1]"
                    }`}
                  >
                    {item.done && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      item.done ? "text-[#1E293B]" : "text-[#94A3B8]"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Counselor Card */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-[#1E293B]">
              Your Expert Counselor
            </h3>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-lg font-bold text-white">
                SW
              </div>
              <div>
                <p className="font-semibold text-[#1E293B]">Sarah Williams</p>
                <p className="text-xs text-[#64748B]">Senior Admissions Expert</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1D4ED8]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Quick Chat
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] py-2.5 text-sm font-semibold text-[#1E293B] transition-all hover:bg-[#F8FAFC]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                Schedule Call
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-[#1E293B]">Quick Stats</h3>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {[
                { label: "Applications", value: "4" },
                { label: "Saved", value: "18" },
                { label: "Scholarships", value: "12" },
                { label: "Messages", value: "3" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-[#2563EB]">{stat.value}</p>
                  <p className="text-xs text-[#64748B]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT AREA */}
        <div className="space-y-6">
          {/* AI Match Score Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="max-w-md">
                <h2 className="text-2xl font-bold">85% Match Score</h2>
                <p className="mt-2 text-sm text-blue-100">
                  Based on your academic profile, preferences, and historical
                  acceptance data.
                </p>
                <button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/30">
                  View Analytics
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              {/* Circular Progress */}
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-4 border-white/30">
                <div className="text-center">
                  <span className="text-3xl font-bold">85%</span>
                  <p className="text-[10px] text-blue-100">Match</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-blue-100">
              <span>Acceptance Potential:</span>
              <div className="h-1.5 w-32 rounded-full bg-white/20">
                <div className="h-1.5 w-[85%] rounded-full bg-white" />
              </div>
              <span className="font-semibold text-white">High</span>
            </div>
          </div>

          {/* Recommended Universities */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#1E293B]">
                  Recommended Universities
                </h2>
                <p className="text-sm text-[#64748B]">Based on your profile</p>
              </div>
              <button className="text-sm font-semibold text-[#2563EB] hover:underline">
                View All →
              </button>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[
                {
                  name: "Stanford University",
                  match: 92,
                  location: "Palo Alto, California",
                  program: "MS Computer Science",
                  tags: ["Ivy League", "High Scholarship"],
                },
                {
                  name: "University of Toronto",
                  match: 88,
                  location: "Toronto, Canada",
                  program: "MBA",
                  tags: ["Research", "Co-op"],
                },
              ].map((uni) => (
                <div
                  key={uni.name}
                  className="group rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-lg font-bold text-white">
                      {uni.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#22C55E]/10 px-2.5 py-1 text-xs font-semibold text-[#22C55E]">
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="4" cy="4" r="4" fill="#22C55E"/>
                      </svg>
                      {uni.match}% Match
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-[#1E293B]">
                    {uni.name}
                  </h3>
                  <p className="text-sm text-[#64748B]">{uni.location}</p>
                  <p className="mt-1 text-sm font-medium text-[#2563EB]">
                    {uni.program}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {uni.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#F1F5F9] px-2.5 py-1 text-[11px] font-medium text-[#64748B]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="mt-4 text-sm font-semibold text-[#2563EB] transition-colors hover:underline">
                    View Details →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1E293B]">
                Upcoming Deadlines
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#EF4444]/10 px-3 py-1 text-xs font-semibold text-[#EF4444]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444]" />
                Urgent
              </span>
            </div>
            <div className="space-y-5">
              {[
                {
                  date: "OCT 15",
                  title: "Common App Deadline",
                  desc: "Early Action: Stanford",
                },
                {
                  date: "NOV 01",
                  title: "IELTS Score Reporting",
                  desc: "Mandatory for Canada Apps",
                },
                {
                  date: "DEC 12",
                  title: "Scholarship Portfolio",
                  desc: "University of Melbourne",
                },
              ].map((deadline) => (
                <div key={deadline.title} className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-[#2563EB]/5 text-center">
                    <span className="text-xs font-bold text-[#2563EB]">
                      {deadline.date.split(" ")[0]}
                    </span>
                    <span className="text-[9px] font-semibold text-[#64748B]">
                      {deadline.date.split(" ")[1]}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1E293B]">
                      {deadline.title}
                    </p>
                    <p className="text-sm text-[#64748B]">{deadline.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics Section */}
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Acceptance Probability", value: "92%", color: "#22C55E" },
              { label: "Scholarship Eligibility", value: "78%", color: "#F59E0B" },
              { label: "Visa Readiness", value: "85%", color: "#2563EB" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-[#E2E8F0] bg-white p-5 text-center shadow-sm"
              >
                <div
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 text-2xl font-bold"
                  style={{
                    borderColor: `${item.color}20`,
                    color: item.color,
                  }}
                >
                  {item.value}
                </div>
                <p className="mt-3 text-sm font-semibold text-[#1E293B]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1E293B]">Recent Activity</h2>
            <div className="mt-4 space-y-4">
              {[
                { action: "SOP Uploaded", time: "2 hours ago" },
                { action: "Transcript Verified", time: "1 day ago" },
                { action: "Recommendation Received", time: "3 days ago" },
                { action: "University Match Updated", time: "5 days ago" },
              ].map((activity) => (
                <div key={activity.action} className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#22C55E]/10">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.3334 4L5.33337 12L2.66671 9.33333" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1E293B]">
                      {activity.action}
                    </p>
                    <p className="text-xs text-[#94A3B8]">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section: Saved + Application Status */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Saved Universities */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1E293B]">
                Saved Universities
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {["Toronto", "Melbourne", "UCL", "British Columbia"].map(
                  (uni) => (
                    <div
                      key={uni}
                      className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] p-3 transition-all hover:border-[#2563EB]/30 hover:bg-[#2563EB]/5"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-xs font-bold text-white">
                        {uni
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </div>
                      <span className="text-sm font-medium text-[#1E293B]">
                        {uni}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Application Status */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1E293B]">
                Application Status
              </h2>
              <div className="mt-4 space-y-4">
                {[
                  { name: "Stanford", progress: 80 },
                  { name: "Toronto", progress: 60 },
                  { name: "Melbourne", progress: 90 },
                ].map((app) => (
                  <div key={app.name}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium text-[#1E293B]">
                        {app.name}
                      </span>
                      <span className="font-semibold text-[#2563EB]">
                        {app.progress}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#E2E8F0]">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED]"
                        style={{ width: `${app.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}