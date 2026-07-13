"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { saveStep1 } from "@/lib/api/academic-profile.api";
import { Step1PersonalSchema } from "@/lib/schemas/academic-profile.schema";
import type { z } from "zod";

type FormData = z.infer<typeof Step1PersonalSchema>;

const qualificationOptions = [
  { value: "high-school", label: "High School" },
  { value: "diploma", label: "Diploma" },
  { value: "bachelor", label: "Bachelor's" },
  { value: "master", label: "Master's" },
  { value: "doctorate", label: "Doctorate" },
];

export default function Step1Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    highestQualification: "bachelor",
    institution: "",
    graduationYear: new Date().getFullYear(),
    fieldOfStudy: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const validated = Step1PersonalSchema.parse(formData);
      const result = await saveStep1(validated);
      if (result.success) {
        router.push("/onboarding/step-2");
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
          <h2 className="text-xl font-bold text-[#0F172A]">Personal Information</h2>
          <p className="mt-1 text-sm text-[#64748B]">Tell us about your academic background</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-[12px] border border-[#EF4444] bg-[#FEF2F2] p-4">
              <p className="text-sm text-[#EF4444]">{error}</p>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <Select
              label="Highest Qualification"
              options={qualificationOptions}
              value={formData.highestQualification}
              onChange={(e) => setFormData({ ...formData, highestQualification: e.target.value as z.infer<typeof Step1PersonalSchema>["highestQualification"] })}
            />

            <Input
              label="Institution Name"
              placeholder="e.g. University of Technology"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              required
            />

            <Input
              label="Graduation Year"
              type="number"
              placeholder="e.g. 2024"
              value={formData.graduationYear.toString()}
              onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) || new Date().getFullYear() })}
              required
            />

            <Input
              label="Field of Study"
              placeholder="e.g. Computer Science"
              value={formData.fieldOfStudy}
              onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-4">
            <Button type="button" variant="secondary" onClick={() => router.push("/dashboard")}>
              Save as Draft
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
