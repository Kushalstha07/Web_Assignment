import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = { title: "Reset Password" };

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0F172A] via-[#1D4ED8]/90 to-[#1D4ED8] px-4">
      <div className="w-full max-w-[420px] rounded-3xl border border-white/10 bg-white/90 px-8 pb-8 pt-10 shadow-2xl backdrop-blur-2xl">
        <div className="mb-8"><h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Choose a new password</h1><p className="mt-2 text-sm text-[#64748B]">Enter a new password for your Edu Global account.</p></div>
        <Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-[#E2E8F0]" />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
