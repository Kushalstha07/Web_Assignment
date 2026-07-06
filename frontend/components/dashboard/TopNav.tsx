"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, Sparkles, Bell, Plus, ChevronDown, User, Settings, HelpCircle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/students": "Students",
  "/applications": "Applications",
  "/universities": "Universities",
  "/scholarships": "Scholarships",
  "/recommendations": "AI Recommendations",
  "/verification": "Document Verification",
  "/pipeline": "Student Pipeline",
  "/analytics": "Analytics",
  "/appointments": "Appointments",
  "/messages": "Messages",
  "/settings": "Settings",
  "/profile": "Profile",
  "/change-password": "Change Password",
  "/reports": "Reports",
  "/counsellors": "Counsellors",
  "/visa": "Visa Processing",
  "/admin/users": "User Management",
};

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const currentPage = breadcrumbMap[pathname] || "Dashboard";
  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";
  const displayName = user?.fullName || "User";
  const role = user?.role === "admin" ? "Admin" : user?.role === "student" ? "Student" : user?.role === "counsellor" ? "Counsellor" : "User";

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-[#E5E7EB] bg-white/80 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left: Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#64748B]">Home</span>
          <span className="text-[#94A3B8]">/</span>
          <span className="font-semibold text-[#0F172A]">{currentPage}</span>
        </div>

        {/* Center: Global Search */}
        <div className="mx-8 hidden flex-1 max-w-xl md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search students, universities, applications..."
              className="h-10 w-full rounded-[12px] border border-[#E5E7EB] bg-[#F8FAFC] pl-10 pr-4 text-sm outline-none transition-all placeholder:text-[#94A3B8] hover:border-[#CBD5E1] focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/15"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* AI Assistant Button - Highlighted */}
          <button className="flex items-center gap-2 rounded-[12px] bg-gradient-to-r from-[#7C3AED] to-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">AI Assistant</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-[12px] p-2 text-[#64748B] transition-all hover:bg-[#F8FAFC] hover:text-[#0F172A]"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#EF4444]" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-[20px] border border-[#E5E7EB] bg-white p-4 shadow-lg">
                <h3 className="mb-3 text-sm font-bold text-[#0F172A]">Notifications</h3>
                <div className="space-y-3">
                  {[
                    { title: "New application received", time: "2 min ago", unread: true },
                    { title: "Visa approved for John Doe", time: "1 hour ago", unread: true },
                    { title: "Document verification pending", time: "3 hours ago", unread: false },
                  ].map((notification, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "rounded-xl p-3 transition-all",
                        notification.unread ? "bg-[#EEF5FF]" : "hover:bg-[#F8FAFC]"
                      )}
                    >
                      <p className="text-sm font-medium text-[#0F172A]">{notification.title}</p>
                      <p className="mt-1 text-xs text-[#64748B]">{notification.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Add */}
          <button className="rounded-[12px] p-2 text-[#64748B] transition-all hover:bg-[#F8FAFC] hover:text-[#0F172A]">
            <Plus className="h-5 w-5" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 rounded-[12px] p-1.5 pr-3 transition-all hover:bg-[#F8FAFC]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-sm font-bold text-white">
                {initials}
              </div>
              <ChevronDown className="h-4 w-4 text-[#64748B]" />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 rounded-[20px] border border-[#E5E7EB] bg-white p-2 shadow-lg">
                <div className="mb-2 border-b border-[#E5E7EB] pb-2">
                  <p className="text-sm font-semibold text-[#0F172A]">{displayName}</p>
                  <p className="text-xs text-[#64748B]">{role}</p>
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => { setShowProfile(false); router.push("/profile"); }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#64748B] transition-all hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button
                    onClick={() => { setShowProfile(false); router.push("/settings"); }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#64748B] transition-all hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <button
                    onClick={() => { setShowProfile(false); router.push("/change-password"); }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#64748B] transition-all hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                  >
                    <HelpCircle className="h-4 w-4" />
                    Change Password
                  </button>
                  <div className="border-t border-[#E5E7EB] my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-600 transition-all hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}