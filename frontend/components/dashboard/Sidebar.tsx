"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "grid" },
  { href: "/applications", label: "Applications", icon: "file" },
  { href: "/universities", label: "Universities", icon: "building" },
  { href: "/scholarships", label: "Scholarships", icon: "award" },
  { href: "/messages", label: "Messages", icon: "message" },
];

const adminNavItems = [
  { href: "/admin/users", label: "User Management", icon: "users" },
];

const bottomItems = [
  { href: "/profile", label: "Profile", icon: "user" },
  { href: "/change-password", label: "Change Password", icon: "lock" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

function Icon({ name, className }: { name: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    grid: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
    file: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    building: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
        <path d="M10 6h4" />
        <path d="M10 10h4" />
        <path d="M10 14h4" />
        <path d="M10 18h4" />
      </svg>
    ),
    award: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
    message: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    user: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    lock: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    settings: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    users: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  };

  return icons[name] || null;
}

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] border-r border-[#E8EEF7] bg-white">
      {/* Logo */}
      <div className="flex h-20 items-center gap-2.5 px-6">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#1565D8" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="4" fill="#1565D8" />
          <path d="M2 12H22" stroke="#1565D8" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 2C15 5 16.5 8.5 16.5 12C16.5 15.5 15 19 12 22" stroke="#1565D8" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 2C9 5 7.5 8.5 7.5 12C7.5 15.5 9 19 12 22" stroke="#1565D8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="text-xl font-bold text-[#172B4D]">EduGlobal</span>
      </div>

      {/* Main Navigation */}
      <nav className="mt-4 px-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              isActive(item.href)
                ? "bg-[#EEF5FF] text-[#1565D8]"
                : "text-[#6B7280] hover:bg-[#F8FAFD] hover:text-[#172B4D]"
            }`}
          >
            <Icon name={item.icon} className={isActive(item.href) ? "text-[#1565D8]" : ""} />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-6 my-4 border-t border-[#E8EEF7]" />

      {/* Admin Navigation (only for admins) */}
      {user?.role === "admin" && (
        <>
          <div className="px-3 mb-1">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Admin</p>
          </div>
          <nav className="px-3">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive(item.href)
                    ? "bg-[#EEF5FF] text-[#1565D8]"
                    : "text-[#6B7280] hover:bg-[#F8FAFD] hover:text-[#172B4D]"
                }`}
              >
                <Icon name={item.icon} className={isActive(item.href) ? "text-[#1565D8]" : ""} />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mx-6 my-4 border-t border-[#E8EEF7]" />
        </>
      )}

      {/* Bottom Navigation */}
      <nav className="px-3">
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              isActive(item.href)
                ? "bg-[#EEF5FF] text-[#1565D8]"
                : "text-[#6B7280] hover:bg-[#F8FAFD] hover:text-[#172B4D]"
            }`}
          >
            <Icon name={item.icon} className={isActive(item.href) ? "text-[#1565D8]" : ""} />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-6 left-0 right-0 px-3">
        <button
          onClick={async () => {
            await logout();
            window.location.href = "/login";
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#6B7280] transition-all hover:bg-red-50 hover:text-red-600"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}