"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 mx-auto" />
          <p className="mt-4 text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Edu Global</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
          Welcome, {user.fullName}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          You are logged in as <strong>{user.email}</strong>.
        </p>

        {/* User Info Summary */}
        <div className="mt-6 grid gap-4 rounded-lg border border-slate-100 bg-slate-50 p-4 sm:grid-cols-2">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Username
            </span>
            <p className="mt-1 text-sm text-slate-900">{user.username}</p>
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Phone
            </span>
            <p className="mt-1 text-sm text-slate-900">{user.phoneNumber}</p>
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Study Level
            </span>
            <p className="mt-1 text-sm text-slate-900">
              {user.studyLevel.charAt(0).toUpperCase() +
                user.studyLevel.slice(1).replace("-", " ")}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Destination
            </span>
            <p className="mt-1 text-sm text-slate-900">
              {user.destination.charAt(0).toUpperCase() +
                user.destination.slice(1)}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Field of Study
            </span>
            <p className="mt-1 text-sm text-slate-900">{user.fieldOfStudy}</p>
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Intake
            </span>
            <p className="mt-1 text-sm text-slate-900">
              {user.intake.charAt(0).toUpperCase() + user.intake.slice(1)}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/profile"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Update Profile
          </Link>
          <Link
            href="/change-password"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Change Password
          </Link>
        </div>

        <div className="mt-4">
          <button
            onClick={handleLogout}
            className="inline-flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}