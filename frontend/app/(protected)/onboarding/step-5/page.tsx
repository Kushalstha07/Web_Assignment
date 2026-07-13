"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { getMyProfile } from "@/lib/api/academic-profile.api";
import { ApiError } from "@/lib/api/client";

export default function Step5Page() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let dashboardTimer: number | undefined;
    let cancelled = false;
    const loadTimer = window.setTimeout(() => {
      void getMyProfile()
        .then((result) => {
          if (cancelled) return;
          if (!result.data.onboardingCompletedAt || result.data.onboardingStep < 5) {
            router.replace(`/onboarding/step-${Math.min(result.data.onboardingStep, 4)}`);
            return;
          }
          setChecking(false);
          dashboardTimer = window.setTimeout(() => router.push("/dashboard"), 5000);
        })
        .catch((cause) => {
          if (cancelled) return;
          if (cause instanceof ApiError && cause.status === 404) {
            router.replace("/onboarding/step-1");
            return;
          }
          setError(cause instanceof Error ? cause.message : "Failed to verify profile completion");
          setChecking(false);
        });
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(loadTimer);
      if (dashboardTimer) window.clearTimeout(dashboardTimer);
    };
  }, [router]);

  if (checking) return <SkeletonCard />;

  return (
    <Card>
      <CardContent className="p-6 lg:p-8">
        {error && <div className="mb-6 rounded-[12px] border border-[#EF4444] bg-[#FEF2F2] p-4 text-sm text-[#EF4444]">{error}</div>}
        <div className="py-12 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#22C55E]">
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-[#0F172A]">You&apos;re all set!</h2>
          <p className="mt-2 text-sm text-[#64748B]">
            Your profile is complete. You&apos;ll be redirected to your dashboard shortly.
          </p>

          <div className="mx-auto mt-8 max-w-xs">
            <ProgressBar value={100} size="md" showLabel />
          </div>

          <div className="mt-8">
            <Button onClick={() => router.push("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
