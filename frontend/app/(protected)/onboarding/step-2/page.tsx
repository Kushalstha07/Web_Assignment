"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { Button } from "@/components/ui/Button";
import { getMyProfile, saveStep2 } from "@/lib/api/academic-profile.api";
import { uploadDocument } from "@/lib/api/document.api";
import { ApiError } from "@/lib/api/client";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Step2AcademicSchema } from "@/lib/schemas/academic-profile.schema";
import type { z } from "zod";

type FormData = z.infer<typeof Step2AcademicSchema>;

const testTypeOptions = [
  { value: "IELTS", label: "IELTS" },
  { value: "TOEFL", label: "TOEFL" },
  { value: "GRE", label: "GRE" },
  { value: "GMAT", label: "GMAT" },
];

export default function Step2Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [draftLoading, setDraftLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    gpa: undefined,
    testType: undefined,
    testScore: undefined,
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void getMyProfile()
        .then((result) => {
          const profile = result.data;
          setFormData({ gpa: profile.gpa, testType: profile.testType, testScore: profile.testScore });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const validated = Step2AcademicSchema.parse(formData);
      const result = await saveStep2(validated);
      if (result.success) {
        if (transcriptFile) await uploadDocument(transcriptFile, "transcript", "Uploaded during onboarding");
        router.push("/onboarding/step-3");
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

  if (draftLoading) return <SkeletonCard />;

  return (
    <Card>
      <CardContent className="p-6 lg:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#0F172A]">Academic History</h2>
          <p className="mt-1 text-sm text-[#64748B]">Add your test scores and upload transcripts</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-[12px] border border-[#EF4444] bg-[#FEF2F2] p-4">
              <p className="text-sm text-[#EF4444]">{error}</p>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label="GPA (optional)"
              type="number"
              step="0.01"
              min="0"
              max="4.0"
              placeholder="e.g. 3.75"
              value={formData.gpa?.toString() || ""}
              onChange={(e) => setFormData({ ...formData, gpa: e.target.value ? parseFloat(e.target.value) : undefined })}
            />

            <Select
              label="Test Type (optional)"
              options={testTypeOptions}
              value={formData.testType || ""}
              onChange={(e) => setFormData({ ...formData, testType: (e.target.value || undefined) as z.infer<typeof Step2AcademicSchema>["testType"] })}
            />

            <Input
              label="Test Score (optional)"
              type="number"
              step="0.01"
              min="0"
              max={formData.testType === "IELTS" ? "9" : formData.testType === "TOEFL" ? "120" : formData.testType === "GRE" ? "340" : formData.testType === "GMAT" ? "800" : "800"}
              placeholder="e.g. 7.5"
              value={formData.testScore?.toString() || ""}
              onChange={(e) => setFormData({ ...formData, testScore: e.target.value ? parseFloat(e.target.value) : undefined })}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#0F172A]">
              Transcript / Marksheet (optional)
            </label>
            <FileDropzone
              accept="application/pdf,image/*"
              maxSize={5 * 1024 * 1024}
              onFilesSelected={(files) => setTranscriptFile(files[0] || null)}
              label="Drag & drop your transcript here, or click to browse"
            />
            {transcriptFile && (
              <p className="mt-2 text-xs text-[#64748B]">
                Selected: {transcriptFile.name} ({(transcriptFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Button type="button" variant="secondary" onClick={() => router.push("/onboarding/step-1")}>
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
