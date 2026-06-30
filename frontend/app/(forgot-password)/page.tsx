import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0F172A] via-[#1D4ED8]/90 to-[#1D4ED8] px-4">
      <div className="w-full max-w-[420px] rounded-3xl border border-white/10 bg-white/80 px-8 pb-8 pt-10 shadow-2xl shadow-black/10 backdrop-blur-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
            Reset password
          </h1>
          <p className="mt-2 text-sm text-[#64748B]">
            Enter your email address and we'll send you a reset link.
          </p>
        </div>

        <form className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#0F172A]">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="alex.mercer@gmail.com"
              className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15"
            />
          </div>

          <button
            type="submit"
            className="relative h-12 w-full overflow-hidden rounded-xl bg-[#1D4ED8] text-sm font-bold text-white shadow-lg shadow-[#1D4ED8]/20 transition-all hover:shadow-xl"
          >
            Send Reset Link
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-[#64748B]">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#1D4ED8] hover:underline"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </main>
  );
}