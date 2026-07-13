"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getMyProfile, saveStep3 } from "@/lib/api/academic-profile.api";
import { ApiError } from "@/lib/api/client";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { preferredCountries, Step3PreferencesSchema } from "@/lib/schemas/academic-profile.schema";
import type { z } from "zod";

type FormData = z.infer<typeof Step3PreferencesSchema>;
type PreferredCountry = FormData["preferredCountries"][number];

const countryOptions: Array<{ value: PreferredCountry; label: string }> = [
  { value: "usa", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "canada", label: "Canada" },
  { value: "australia", label: "Australia" },
  { value: "europe", label: "Europe" },
];

export default function Step3Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [draftLoading, setDraftLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    preferredCountries: [],
    tuitionBudget: "under-10k",
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void getMyProfile()
        .then((result) => {
          const profile = result.data;
          if (profile.onboardingStep < 3) {
            router.replace(`/onboarding/step-${profile.onboardingStep}`);
            return;
          }
          const savedCountries = (profile.preferredCountries || []).filter(
            (country): country is PreferredCountry => preferredCountries.includes(country as PreferredCountry),
          );
          setFormData({
            preferredCountries: savedCountries,
            tuitionBudget: (profile.tuitionBudget || "under-10k") as FormData["tuitionBudget"],
          });
        })
        .catch((cause) => {
          if (cause instanceof ApiError && cause.status === 404) {
            router.replace("/onboarding/step-1");
            return;
          }
          setError(cause instanceof Error ? cause.message : "Failed to load your saved profile");
        })
        .finally(() => setDraftLoading(false));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [router]);

  const toggleCountry = (value: PreferredCountry) => {
    const current = formData.preferredCountries;
    const updated = current.includes(value)
      ? current.filter((c) => c !== value)
      : [...current, value];
    setFormData({ ...formData, preferredCountries: updated });
  };

  if (draftLoading) return <SkeletonCard />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const validated = Step3PreferencesSchema.parse(formData);
      const result = await saveStep3(validated);
      if (result.success) {
        router.push("/onboarding/step-4");
      } else {
        setError(result.message || "Failed to save");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Validation failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6 lg:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#0F172A]">Preferences</h2>
          <p className="mt-1 text-sm text-[#64748B]">Tell us about your study preferences</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-[12px] border border-[#EF4444] bg-[#FEF2F2] p-4">
              <p className="text-sm text-[#EF4444]">{error}</p>
            </div>
          )}

          <div>
            <label className="mb-3 block text-sm font-medium text-[#0F172A]">
              Preferred Countries (select all that apply)
            </label>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {countryOptions.map((country) => (
                <label
                  key={country.value}
                  className="flex items-center gap-3 rounded-[12px] border border-[#E5E7EB] bg-white p-4 cursor-pointer transition-all hover:border-[#2563EB] hover:bg-[#EEF5FF]"
                >
                  <input
                    type="checkbox"
                    checked={formData.preferredCountries.includes(country.value)}
                    onChange={() => toggleCountry(country.value)}
                    className="h-4 w-4 rounded border-[#E5E7EB] text-[#2563EB] focus:ring-[#2563EB]"
                  />
                  <span className="text-sm font-medium text-[#0F172A]">{country.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#0F172A]">
              Tuition Budget Range
            </label>
            <select
              value={formData.tuitionBudget}
              onChange={(e) => setFormData({ ...formData, tuitionBudget: e.target.value as FormData["tuitionBudget"] })}
              className="h-11 w-full rounded-[12px] border border-[#E5E7EB] bg-white px-4 text-sm text-[#0F172A] outline-none transition-all appearance-none"
            >
              <option value="" disabled>Select budget range</option>
              <option value="under-10k">Under $10,000</option>
              <option value="10k-20k">$10,000 - $20,000</option>
              <option value="20k-35k">$20,000 - $35,000</option>
              <option value="35k-plus">$35,000+</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <Button type="button" variant="secondary" onClick={() => router.push("/onboarding/step-2")}>
              Back
            </Button>
            <Button type="submit" loading={loading}>
              Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
