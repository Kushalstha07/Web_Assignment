"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { completeOnboarding, getMyProfile } from "@/lib/api/academic-profile.api";
import { ApiError } from "@/lib/api/client";
import type { AcademicProfile } from "@/lib/schemas/academic-profile.schema";

export default function Step4Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState<AcademicProfile | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void getMyProfile()
        .then((result) => {
          if (result.data.onboardingStep < 4) {
            router.replace(`/onboarding/step-${result.data.onboardingStep}`);
            return;
          }
          setProfile(result.data);
        })
        .catch((cause) => {
          if (cause instanceof ApiError && cause.status === 404) {
            router.replace("/onboarding/step-1");
            return;
          }
          setError(cause instanceof Error ? cause.message : "Failed to load your profile");
        })
        .finally(() => setLoading(false));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [router]);

  const handleComplete = async () => {
    try {
      setSubmitting(true);
      setError("");
      await completeOnboarding();
      router.push("/onboarding/step-5");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to submit your profile");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 lg:p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 rounded-[12px] bg-[#E5E7EB]"></div>
            <div className="h-48 rounded-[20px] bg-[#E5E7EB]"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6 lg:p-8">
          <p className="text-sm text-[#EF4444]">{error || "Failed to load profile. Please try again."}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 lg:p-8">
        {error && <div className="mb-6 rounded-[12px] border border-[#EF4444] bg-[#FEF2F2] p-4 text-sm text-[#EF4444]">{error}</div>}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#0F172A]">Review Your Profile</h2>
          <p className="mt-1 text-sm text-[#64748B]">Make sure everything looks good before submitting</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="flex flex-col items-center justify-center rounded-[20px] bg-gradient-to-br from-[#F5F7FA] to-[#EEF5FF] p-6">
            <ProgressBar value={profile.profileStrength || 0} size="lg" showLabel />
            <p className="mt-3 text-xs text-[#64748B]">Profile Strength</p>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-[16px] border border-[#E5E7EB] bg-white p-5">
              <h3 className="mb-2 text-sm font-medium text-[#64748B]">Personal Information</h3>
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <p className="text-xs text-[#64748B]">Qualification</p>
                  <p className="text-sm font-medium text-[#0F172A] capitalize">{profile.highestQualification}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Institution</p>
                  <p className="text-sm font-medium text-[#0F172A]">{profile.institution}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Graduation Year</p>
                  <p className="text-sm font-medium text-[#0F172A]">{profile.graduationYear}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Field of Study</p>
                  <p className="text-sm font-medium text-[#0F172A]">{profile.fieldOfStudy}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[16px] border border-[#E5E7EB] bg-white p-5">
              <h3 className="mb-2 text-sm font-medium text-[#64748B]">Academic Details</h3>
              <div className="grid gap-2 md:grid-cols-3">
                <div>
                  <p className="text-xs text-[#64748B]">GPA</p>
                  <p className="text-sm font-medium text-[#0F172A]">{profile.gpa?.toFixed(2) || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Test Type</p>
                  <p className="text-sm font-medium text-[#0F172A]">{profile.testType || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Test Score</p>
                  <p className="text-sm font-medium text-[#0F172A]">{profile.testScore?.toFixed(1) || "Not provided"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[16px] border border-[#E5E7EB] bg-white p-5">
              <h3 className="mb-2 text-sm font-medium text-[#64748B]">Preferences</h3>
              <div className="flex flex-wrap items-center gap-2">
                {(profile.preferredCountries || []).map((country) => (
                  <span
                    key={country}
                    className="rounded-[20px] bg-[#EEF5FF] px-3 py-1 text-xs font-medium text-[#2563EB]"
                  >
                    {country}
                  </span>
                ))}
                {!profile.preferredCountries?.length && (
                  <span className="text-sm text-[#64748B]">No countries selected</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Button type="button" variant="secondary" onClick={() => router.push("/onboarding/step-3")}>
            Back
          </Button>
          <Button type="button" onClick={handleComplete} loading={submitting}>
            Submit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
