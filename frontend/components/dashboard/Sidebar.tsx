"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Building2,
  Award,
  Sparkles,
  FileCheck,
  Plane,
  UserCheck,
  Calendar,
  MessageSquare,
  BarChart3,
  LineChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/students", label: "Students", icon: Users },
  { href: "/applications", label: "Applications", icon: FileText },
  { href: "/universities", label: "Universities", icon: Building2 },
  { href: "/scholarships", label: "Scholarships", icon: Award },
  { href: "/recommendations", label: "AI Recommendations", icon: Sparkles },
];

const workflowNavItems = [
  { href: "/verification", label: "Document Verification", icon: FileCheck },
  { href: "/visa", label: "Visa Processing", icon: Plane },
  { href: "/counsellors", label: "Counsellors", icon: UserCheck },
  { href: "/appointments", label: "Appointments", icon: Calendar },
];

const bottomNavItems = [
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/analytics", label: "Analytics", icon: LineChart },
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavItem({
  item,
  isActive,
  collapsed,
}: {
  item: { href: string; label: string; icon: React.ElementType };
  isActive: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
        isActive
          ? "bg-[#EEF5FF] text-[#1565D8]"
          : "text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#172B4D]",
        collapsed && "justify-center px-2"
      )}
      title={collapsed ? item.label : undefined}
    >
      <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-[#1565D8]")} />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen border-r border-[#E8EEF7] bg-white transition-all duration-300",
        collapsed ? "w-[80px]" : "w-[280px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-20 items-center gap-2.5 px-6">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#1565D8" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="4" fill="#1565D8" />
          <path d="M2 12H22" stroke="#1565D8" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 2C15 5 16.5 8.5 16.5 12C16.5 15.5 15 19 12 22" stroke="#1565D8" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 2C9 5 7.5 8.5 7.5 12C7.5 15.5 9 19 12 22" stroke="#1565D8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {!collapsed && <span className="text-xl font-bold text-[#172B4D]">EduGlobal</span>}
      </div>

      {/* Main Navigation */}
      <nav className="mt-4 px-3 space-y-1">
        {mainNavItems.map((item) => (
          <NavItem key={item.href} item={item} isActive={isActive(item.href)} collapsed={collapsed} />
        ))}
      </nav>

      {/* Divider */}
      {!collapsed && <div className="mx-6 my-4 border-t border-[#E8EEF7]" />}

      {/* Workflow Navigation */}
      {!collapsed && (
        <>
          <div className="px-3 mb-1">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Workflow</p>
          </div>
          <nav className="px-3 space-y-1">
            {workflowNavItems.map((item) => (
              <NavItem key={item.href} item={item} isActive={isActive(item.href)} collapsed={collapsed} />
            ))}
          </nav>
          <div className="mx-6 my-4 border-t border-[#E8EEF7]" />
        </>
      )}

      {collapsed && (
        <nav className="px-3 space-y-1">
          {workflowNavItems.map((item) => (
            <NavItem key={item.href} item={item} isActive={isActive(item.href)} collapsed={collapsed} />
          ))}
        </nav>
      )}

      {/* Bottom Navigation */}
      <nav className="px-3 space-y-1">
        {bottomNavItems.map((item) => (
          <NavItem key={item.href} item={item} isActive={isActive(item.href)} collapsed={collapsed} />
        ))}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute bottom-20 right-3 rounded-lg border border-[#E5E7EB] bg-white p-2 text-[#64748B] transition-all hover:bg-[#F8FAFC] hover:text-[#0F172A]"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {/* Logout */}
      <div className="absolute bottom-6 left-0 right-0 px-3">
        <button
          onClick={async () => {
            await logout();
            window.location.href = "/login";
          }}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#6B7280] transition-all hover:bg-red-50 hover:text-red-600",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}