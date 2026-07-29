"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/api/auth.api";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      const response = await requestPasswordReset(email.trim());
      setMessage(response.message);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to request a reset link");
    } finally {
      setLoading(false);
    }
  }

  if (message) {
    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-800">{message}</div>
        <p className="text-sm text-[#64748B]">Check your inbox and spam folder. Reset links expire after one hour.</p>
        <Link href="/login" className="block h-12 rounded-xl bg-[#1D4ED8] px-4 py-3 text-center text-sm font-bold text-white">Back to Login</Link>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={submit} className="space-y-5">
        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-semibold text-[#0F172A]">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="alex.mercer@gmail.com"
            className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15"
          />
        </div>
        <button disabled={loading} type="submit" className="h-12 w-full rounded-xl bg-[#1D4ED8] text-sm font-bold text-white shadow-lg shadow-[#1D4ED8]/20 transition hover:bg-[#1E40AF] disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Sending…" : "Send Reset Link"}
        </button>
      </form>
      <p className="mt-5 text-center text-xs text-[#64748B]">Remember your password? <Link href="/login" className="font-semibold text-[#1D4ED8] hover:underline">Back to Login</Link></p>
    </>
  );
}
