import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

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
            Enter your email address and we&apos;ll send you a reset link.
          </p>
        </div>

        <ForgotPasswordForm />
      </div>
    </main>
  );
}
