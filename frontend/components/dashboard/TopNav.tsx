"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Search, Sparkles, Bell, Plus, ChevronDown, User } from "lucide-react";
import { cn } from "@/lib/utils";

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/students": "Students",
  "/applications": "Applications",
  "/universities": "Universities",
  "/scholarships": "Scholarships",
  "/verification": "Document Verification",
  "/pipeline": "Student Pipeline",
  "/analytics": "Analytics",
  "/appointments": "Appointments",
  "/messages": "Messages",
  "/settings": "Settings",
};

export default function TopNav() {
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const currentPage = breadcrumbMap[pathname] || "Dashboard";

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
                JD
              </div>
              <ChevronDown className="h-4 w-4 text-[#64748B]" />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 rounded-[20px] border border-[#E5E7EB] bg-white p-2 shadow-lg">
                <div className="mb-2 border-b border-[#E5E7EB] pb-2">
                  <p className="text-sm font-semibold text-[#0F172A]">John Doe</p>
                  <p className="text-xs text-[#64748B]">Admin</p>
                </div>
                <div className="space-y-1">
                  {["Profile", "Settings", "Help", "Sign out"].map((item) => (
                    <button
                      key={item}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#64748B] transition-all hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                    >
                      {item === "Profile" && <User className="h-4 w-4" />}
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}