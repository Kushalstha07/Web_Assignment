"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, Sparkles, Bell, Plus, ChevronDown, User, Settings, HelpCircle, LogOut, CheckCheck, Trash2, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { deleteNotification, getNotifications, getUnreadCount, markAllNotificationsAsRead, markNotificationsAsRead, type Notification } from "@/lib/api/notification.api";

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/students": "Students",
  "/applications": "Applications",
  "/universities": "Universities",
  "/scholarships": "Scholarships",
  "/recommendations": "Recommendations",
  "/verification": "Document Verification",
  "/pipeline": "Student Pipeline",
  "/analytics": "Analytics",
  "/appointments": "Appointments",
  "/messages": "Messages",
  "/ai-chat": "AI Chat",
  "/settings": "Settings",
  "/profile": "Profile",
  "/change-password": "Change Password",
  "/reports": "Reports",
  "/counsellors": "Counsellors",
  "/visa": "Visa Processing",
  "/admin/users": "User Management",
};

export default function TopNav({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationError, setNotificationError] = useState("");

  const refreshNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const [list, unread] = await Promise.all([getNotifications(1, 10), getUnreadCount()]);
      setNotifications(list.data || []);
      setUnreadCount(unread.data?.count || 0);
      setNotificationError("");
    } catch (cause) {
      setNotificationError(cause instanceof Error ? cause.message : "Unable to load notifications");
    }
  }, [user]);

  useEffect(() => {
    const timer = window.setTimeout(() => void refreshNotifications(), 0);
    const interval = window.setInterval(() => void refreshNotifications(), 60_000);
    const refreshOnFocus = () => void refreshNotifications();
    window.addEventListener("focus", refreshOnFocus);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshOnFocus);
    };
  }, [refreshNotifications]);

  const openNotifications = async () => {
    const next = !showNotifications;
    setShowNotifications(next);
    if (next) {
      setNotificationsLoading(true);
      try {
        await refreshNotifications();
      } finally {
        setNotificationsLoading(false);
      }
    }
  };

  const openNotification = async (notification: Notification) => {
    if (!notification.read) {
      try {
        await markNotificationsAsRead([notification.id]);
      } catch (cause) {
        setNotificationError(cause instanceof Error ? cause.message : "Unable to mark notification as read");
        return;
      }
      setNotifications((current) => current.map((item) => item.id === notification.id ? { ...item, read: true } : item));
      setUnreadCount((count) => Math.max(0, count - 1));
    }
    setShowNotifications(false);
    if (notification.link) router.push(notification.link);
  };

  const markAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
    } catch (cause) {
      setNotificationError(cause instanceof Error ? cause.message : "Unable to mark notifications as read");
      return;
    }
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
    setUnreadCount(0);
  };

  const removeNotification = async (id: string) => {
    const removed = notifications.find((item) => item.id === id);
    try {
      await deleteNotification(id);
    } catch (cause) {
      setNotificationError(cause instanceof Error ? cause.message : "Unable to delete notification");
      return;
    }
    setNotifications((current) => current.filter((item) => item.id !== id));
    if (removed && !removed.read) setUnreadCount((count) => Math.max(0, count - 1));
  };

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
    <header className="sticky top-0 z-30 h-16 border-b border-[#E7EDF6] bg-white/90 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-6">
        {/* Left: Breadcrumb */}
        <div className="flex min-w-0 items-center gap-2 text-sm">
          <button onClick={onOpenSidebar} aria-label="Open navigation" className="mr-1 rounded-xl p-2 text-[#64748B] hover:bg-[#F1F5F9] lg:hidden"><Menu className="h-5 w-5"/></button>
          <span className="hidden text-[#64748B] sm:inline">Workspace</span>
          <span className="hidden text-[#94A3B8] sm:inline">/</span>
          <span className="font-semibold text-[#0F172A]">{currentPage}</span>
        </div>

        {/* Center: Global Search */}
        <div className="mx-4 hidden flex-1 max-w-xl xl:block">
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
          {user?.role === "student" && <button onClick={() => router.push("/recommendations")} className="hidden items-center gap-2 rounded-[12px] bg-gradient-to-r from-[#7C3AED] to-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:flex">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">My Matches</span>
          </button>}

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={openNotifications}
              aria-label="Open notifications"
              className="relative rounded-[12px] p-2 text-[#64748B] transition-all hover:bg-[#F8FAFC] hover:text-[#0F172A]"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#EF4444] px-1 text-[10px] font-bold text-white">{unreadCount > 9 ? "9+" : unreadCount}</span>}
            </button>

            {showNotifications && (
              <div className="fixed inset-x-3 top-16 mt-2 rounded-[20px] border border-[#E5E7EB] bg-white p-4 shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:w-96">
                <div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-bold text-[#0F172A]">Notifications</h3>{unreadCount > 0 && <button onClick={markAllRead} className="flex items-center gap-1 text-xs font-semibold text-[#2563EB]"><CheckCheck className="h-3.5 w-3.5"/>Mark all read</button>}</div>
                <div className="max-h-96 space-y-2 overflow-y-auto">
                  {notificationError && <p className="rounded-lg bg-red-50 p-2 text-xs text-red-700">{notificationError}</p>}
                  {notificationsLoading && <p className="py-6 text-center text-sm text-[#64748B]">Loading…</p>}
                  {!notificationsLoading && notifications.length === 0 && <p className="py-6 text-center text-sm text-[#64748B]">You are all caught up.</p>}
                  {notifications.map((notification) => (
                    <div key={notification.id} className={cn("group flex items-start gap-2 rounded-xl p-3 transition-all", !notification.read ? "bg-[#EEF5FF]" : "hover:bg-[#F8FAFC]")}>
                      <button onClick={() => openNotification(notification)} className="min-w-0 flex-1 text-left"><p className="truncate text-sm font-medium text-[#0F172A]">{notification.title}</p><p className="mt-1 line-clamp-2 text-xs text-[#64748B]">{notification.message}</p><p className="mt-1 text-[10px] text-[#94A3B8]">{new Date(notification.createdAt).toLocaleString()}</p></button>
                      <button aria-label="Delete notification" onClick={() => removeNotification(notification.id)} className="rounded-lg p-1 text-[#94A3B8] opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"><Trash2 className="h-3.5 w-3.5"/></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Add */}
          <button onClick={() => router.push(user?.role === "admin" ? "/admin/users" : "/applications")} aria-label="Quick add" className="hidden rounded-[12px] p-2 text-[#64748B] transition-all hover:bg-[#F8FAFC] hover:text-[#0F172A] sm:block">
            <Plus className="h-5 w-5" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 rounded-[12px] p-1.5 transition-all hover:bg-[#F8FAFC] sm:pr-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-sm font-bold text-white">
                {initials}
              </div>
              <ChevronDown className="hidden h-4 w-4 text-[#64748B] sm:block" />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-64 rounded-[20px] border border-[#E5E7EB] bg-white p-2 shadow-xl">
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
