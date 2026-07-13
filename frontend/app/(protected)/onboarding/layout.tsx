"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Stepper, Step } from "@/components/ui/Stepper";

const steps: Step[] = [
  { title: "Personal Info", description: "Qualification & institution" },
  { title: "Academic History", description: "GPA & test scores" },
  { title: "Preferences", description: "Countries & budget" },
  { title: "Review", description: "Confirm your profile" },
  { title: "Complete", description: "Ready to fly" },
];

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const routeStep = Number(pathname.match(/step-(\d+)/)?.[1] || 1);
  const currentStep = Math.min(Math.max(routeStep - 1, 0), steps.length - 1);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 h-12 w-full animate-pulse rounded-[20px] bg-[#E5E7EB]" />
          <div className="h-64 w-full animate-pulse rounded-[20px] bg-[#E5E7EB]" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#0F172A]">Complete Your Profile</h1>
          <p className="mt-2 text-sm text-[#64748B]">Let&apos;s get you set up for success</p>
        </div>

        {/* Stepper */}
        <div className="mb-10 rounded-[20px] bg-white p-6 shadow-sm">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
