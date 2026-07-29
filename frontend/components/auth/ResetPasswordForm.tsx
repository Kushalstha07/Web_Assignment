"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/api/auth.api";

export function ResetPasswordForm() {
  const token = useSearchParams().get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await resetPassword({ token, newPassword, confirmNewPassword });
      setComplete(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to reset your password");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return <div className="space-y-5"><div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">This reset link is invalid. Request a new link to continue.</div><Link href="/forgot-password" className="block text-center text-sm font-semibold text-[#1D4ED8] hover:underline">Request a new link</Link></div>;
  }

  if (complete) {
    return <div className="space-y-5"><div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">Your password has been reset. You can now sign in with the new password.</div><Link href="/login" className="block h-12 rounded-xl bg-[#1D4ED8] px-4 py-3 text-center text-sm font-bold text-white">Go to Login</Link></div>;
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <label className="block space-y-1.5 text-sm font-semibold text-[#0F172A]">New password<input required minLength={8} type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15"/><span className="block text-xs font-normal text-[#64748B]">Use at least 8 characters.</span></label>
      <label className="block space-y-1.5 text-sm font-semibold text-[#0F172A]">Confirm new password<input required minLength={8} type="password" autoComplete="new-password" value={confirmNewPassword} onChange={(event) => setConfirmNewPassword(event.target.value)} className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15"/></label>
      <button disabled={loading} type="submit" className="h-12 w-full rounded-xl bg-[#1D4ED8] text-sm font-bold text-white transition hover:bg-[#1E40AF] disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Resetting…" : "Reset Password"}</button>
    </form>
  );
}
