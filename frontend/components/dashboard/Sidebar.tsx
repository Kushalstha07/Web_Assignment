"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Award, BarChart3, Building2, Calendar, ChevronLeft, ChevronRight, FileCheck,
  FileText, LayoutDashboard, LineChart, LogOut, MessageSquare, Plane, Settings,
  Shield, Sparkles, User, UserCheck, Users, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: React.ElementType };
type NavGroup = { label?: string; items: NavItem[] };

const adminGroups: NavGroup[] = [
  { label: "Overview", items: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/students", label: "Students", icon: Users },
    { href: "/applications", label: "Applications", icon: FileText },
    { href: "/universities", label: "Universities", icon: Building2 },
    { href: "/scholarships", label: "Scholarships", icon: Award },
    { href: "/recommendations", label: "AI Recommendations", icon: Sparkles },
  ]},
  { label: "Workflow", items: [
    { href: "/verification", label: "Document Verification", icon: FileCheck },
    { href: "/visa", label: "Visa Processing", icon: Plane },
    { href: "/counsellors", label: "Counsellors", icon: UserCheck },
    { href: "/appointments", label: "Appointments", icon: Calendar },
    { href: "/messages", label: "Messages", icon: MessageSquare },
  ]},
  { label: "Insights & system", items: [
    { href: "/reports", label: "Reports", icon: BarChart3 },
    { href: "/analytics", label: "Analytics", icon: LineChart },
    { href: "/admin/users", label: "User Management", icon: Shield },
    { href: "/settings", label: "Settings", icon: Settings },
  ]},
];

const studentGroups: NavGroup[] = [
  { items: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/applications", label: "My Applications", icon: FileText },
    { href: "/universities", label: "Universities", icon: Building2 },
    { href: "/scholarships", label: "Scholarships", icon: Award },
  ]},
  { label: "Services", items: [
    { href: "/appointments", label: "Book Appointment", icon: Calendar },
    { href: "/messages", label: "Messages", icon: MessageSquare },
    { href: "/profile", label: "My Profile", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
  ]},
];

const counsellorGroups: NavGroup[] = [
  { items: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/students", label: "Students", icon: Users },
    { href: "/applications", label: "Applications", icon: FileText },
    { href: "/appointments", label: "Appointments", icon: Calendar },
    { href: "/messages", label: "Messages", icon: MessageSquare },
  ]},
  { label: "Account", items: [
    { href: "/profile", label: "My Profile", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
  ]},
];

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function Sidebar({ collapsed, mobileOpen, onToggle, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const groups = user?.role === "admin" ? adminGroups : user?.role === "counsellor" ? counsellorGroups : studentGroups;
  const portalName = user?.role === "admin" ? "Admin workspace" : user?.role === "counsellor" ? "Counsellor workspace" : "Student portal";

  return <aside className={cn(
    "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[#E7EDF6] bg-white shadow-xl shadow-slate-900/5 transition-[width,transform] duration-300 lg:translate-x-0 lg:shadow-none",
    collapsed ? "lg:w-20" : "lg:w-[280px]",
    "w-[280px]",
    mobileOpen ? "translate-x-0" : "-translate-x-full",
  )}>
    <div className={cn("flex h-18 shrink-0 items-center border-b border-[#EEF2F7] px-5", collapsed && "lg:justify-center lg:px-3")}>
      <Link href="/dashboard" onClick={onClose} className="flex min-w-0 items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-white shadow-lg shadow-blue-500/20"><Building2 className="h-5 w-5"/></span>
        <span className={cn("min-w-0", collapsed && "lg:hidden")}><span className="block truncate text-lg font-extrabold tracking-tight text-[#0F172A]">EduGlobal</span><span className="block truncate text-[10px] font-bold uppercase tracking-[0.16em] text-[#94A3B8]">{portalName}</span></span>
      </Link>
      <button onClick={onClose} aria-label="Close navigation" className="ml-auto rounded-xl p-2 text-[#64748B] hover:bg-[#F1F5F9] lg:hidden"><X className="h-5 w-5"/></button>
    </div>

    <div className="admin-scrollbar flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
      {groups.map((group, index) => <div key={group.label || index} className={cn(index > 0 && "mt-5 border-t border-[#EEF2F7] pt-5")}>
        {group.label && <p className={cn("mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#94A3B8]", collapsed && "lg:sr-only")}>{group.label}</p>}
        <nav className="space-y-1">{group.items.map((item) => {
          const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return <Link key={item.href} href={item.href} onClick={onClose} title={collapsed ? item.label : undefined} className={cn(
            "group relative flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-all",
            active ? "bg-[#EEF5FF] text-[#1D4ED8]" : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]",
            collapsed && "lg:justify-center lg:px-2",
          )}>
            {active && <span className="absolute -left-3 h-6 w-1 rounded-r-full bg-[#2563EB]"/>}
            <Icon className={cn("h-[19px] w-[19px] shrink-0 transition-transform group-hover:scale-105", active && "text-[#2563EB]")}/>
            <span className={cn("truncate", collapsed && "lg:hidden")}>{item.label}</span>
          </Link>;
        })}</nav>
      </div>)}
    </div>

    <div className="shrink-0 border-t border-[#EEF2F7] p-3">
      <div className={cn("mb-2 flex items-center gap-3 rounded-xl bg-[#F8FAFC] p-2.5", collapsed && "lg:justify-center")}>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#0F172A] text-xs font-bold text-white">{user?.fullName?.split(" ").map((part) => part[0]).join("").slice(0,2).toUpperCase() || "U"}</span>
        <span className={cn("min-w-0 flex-1", collapsed && "lg:hidden")}><span className="block truncate text-xs font-bold text-[#0F172A]">{user?.fullName}</span><span className="block truncate text-[11px] capitalize text-[#64748B]">{user?.role}</span></span>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={async () => { await logout(); window.location.href = "/login"; }} className={cn("flex h-10 flex-1 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-[#64748B] hover:bg-red-50 hover:text-red-600", collapsed && "lg:justify-center lg:px-2")}><LogOut className="h-[18px] w-[18px]"/><span className={cn(collapsed && "lg:hidden")}>Sign out</span></button>
        <button onClick={onToggle} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} className="hidden h-10 w-10 shrink-0 place-items-center rounded-xl text-[#64748B] hover:bg-[#F1F5F9] lg:grid">{collapsed ? <ChevronRight className="h-4 w-4"/> : <ChevronLeft className="h-4 w-4"/>}</button>
      </div>
    </div>
  </aside>;
}
