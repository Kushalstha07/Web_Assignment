"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Stepper, Step } from "@/components/ui/Stepper";
import { Skeleton } from "@/components/ui/Skeleton";
import { getMyProfile } from "@/lib/api/academic-profile.api";

const steps: Step[] = [
  { title: "Personal Info", description: "Qualification & institution" },
  { title: "Academic History", description: "GPA & test scores" },
  { title: "Preferences", description: "Countries & budget" },
  { title: "Review", description: "Confirm your profile" },
  { title: "Complete", description: "Ready to fly" },
];

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function checkProfile() {
      if (!user) return;
      try {
        const result = await getMyProfile();
        if (result.success && result.data) {
          router.push("/onboarding/step-5");
        }
      } catch {
        setCurrentStep(0);
      } finally {
        setProfileLoaded(true);
      }
    }
    checkProfile();
  }, [user, router]);

  if (loading || !profileLoaded) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <Skeleton className="h-12 w-full rounded-[20px] mb-8" />
          <Skeleton className="h-64 w-full rounded-[20px]" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#0F172A]">Complete Your Profile</h1>
          <p className="mt-2 text-sm text-[#64748B]">Let's get you set up for success</p>
        </div>

        {/* Stepper */}
        <div className="mb-10 rounded-[20px] bg-white p-6 shadow-sm">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={cn(
              "rounded-[12px] px-6 py-2.5 text-sm font-medium transition-all",
              currentStep === 0
                ? "cursor-not-allowed opacity-50"
                : "border border-[#E5E7EB] bg-white text-[#0F172A] hover:bg-[#F8FAFC]",
            )}
          >
            Back
          </button>
          <span className="text-sm text-[#64748B]">
            Step {currentStep + 1} of {steps.length}
          </span>
          <button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            className={cn(
              "rounded-[12px] px-6 py-2.5 text-sm font-medium transition-all",
              currentStep === steps.length - 1
                ? "cursor-not-allowed opacity-50"
                : "bg-[#2563EB] text-white hover:bg-[#1D4ED8]",
            )}
          >
            Next
          </button>
        </div>

        {/* Content */}
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}