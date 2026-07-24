"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, Save } from "lucide-react";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { createUniversity, type CreateUniversityPayload } from "@/lib/api/university.api";

const countryOptions = [
  { label: "United States", value: "usa" },
  { label: "United Kingdom", value: "uk" },
  { label: "Canada", value: "canada" },
  { label: "Australia", value: "australia" },
  { label: "Europe", value: "europe" },
];

const rankingOptions = [
  { label: "Top 10", value: "top-10" },
  { label: "Top 50", value: "top-50" },
  { label: "Top 100", value: "top-100" },
  { label: "Top 200", value: "top-200" },
  { label: "Regional", value: "regional" },
];

const courseTypeOptions = [
  { label: "Undergraduate", value: "undergraduate" },
  { label: "Postgraduate", value: "postgraduate" },
  { label: "Research", value: "research" },
  { label: "Diploma", value: "diploma" },
];

const budgetOptions = [
  { label: "Under $10,000", value: "under-10k" },
  { label: "$10,000 - $20,000", value: "10k-20k" },
  { label: "$20,000 - $35,000", value: "20k-35k" },
  { label: "$35,000+", value: "35k-plus" },
];

type FormState = {
  name: string;
  country: string;
  city: string;
  ranking: string;
  worldRanking: string;
  courseType: string;
  tuitionFee: string;
  budgetRange: string;
  applicationFee: string;
  description: string;
  programs: string;
  rating: string;
  imageUrl: string;
  isActive: boolean;
};

const initialForm: FormState = {
  name: "",
  country: "canada",
  city: "",
  ranking: "top-100",
  worldRanking: "",
  courseType: "undergraduate",
  tuitionFee: "",
  budgetRange: "20k-35k",
  applicationFee: "",
  description: "",
  programs: "",
  rating: "",
  imageUrl: "",
  isActive: true,
};

export default function CreateUniversityPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField(name: keyof FormState, value: string | boolean) {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setSubmitError("");
  }

  function validate() {
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = "University name is required";
    if (!form.city.trim()) nextErrors.city = "City is required";
    if (!form.tuitionFee || Number(form.tuitionFee) <= 0) nextErrors.tuitionFee = "Tuition fee must be greater than 0";
    if (form.worldRanking && Number(form.worldRanking) <= 0) nextErrors.worldRanking = "World ranking must be greater than 0";
    if (form.applicationFee && Number(form.applicationFee) < 0) nextErrors.applicationFee = "Application fee cannot be negative";
    if (form.rating && (Number(form.rating) < 0 || Number(form.rating) > 5)) nextErrors.rating = "Rating must be between 0 and 5";
    if (form.imageUrl) {
      try {
        new URL(form.imageUrl);
      } catch {
        nextErrors.imageUrl = "Enter a valid image URL";
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function buildPayload(): CreateUniversityPayload {
    const programs = form.programs
      .split(/[\n,]/)
      .map((program) => program.trim())
      .filter(Boolean);

    return {
      name: form.name.trim(),
      country: form.country,
      city: form.city.trim(),
      ranking: form.ranking,
      ...(form.worldRanking ? { worldRanking: Number(form.worldRanking) } : {}),
      courseType: form.courseType,
      tuitionFee: Number(form.tuitionFee),
      budgetRange: form.budgetRange,
      ...(form.applicationFee ? { applicationFee: Number(form.applicationFee) } : {}),
      ...(form.description.trim() ? { description: form.description.trim() } : {}),
      ...(programs.length ? { programs } : {}),
      ...(form.rating ? { rating: Number(form.rating) } : {}),
      ...(form.imageUrl.trim() ? { imageUrl: form.imageUrl.trim() } : {}),
      isActive: form.isActive,
    };
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);
      const response = await createUniversity(buildPayload());
      router.push(`/universities/${response.data.id}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to create university");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminGuard>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <button
              onClick={() => router.push("/universities")}
              className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#64748B] transition-colors hover:text-[#0F172A]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to universities
            </button>
            <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Add University</h1>
            <p className="mt-1 text-sm text-[#64748B]">Create a catalog record students can discover and match against.</p>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#EEF5FF]">
            <Building2 className="h-6 w-6 text-[#2563EB]" />
          </div>
        </div>

        {submitError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <Card className="space-y-6">
              <div>
                <h2 className="font-bold text-[#0F172A]">University Details</h2>
                <p className="mt-1 text-sm text-[#64748B]">Core catalog information shown in search and detail pages.</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input label="University Name" value={form.name} onChange={(event) => updateField("name", event.target.value)} error={errors.name} placeholder="University of Toronto" />
                <Input label="City" value={form.city} onChange={(event) => updateField("city", event.target.value)} error={errors.city} placeholder="Toronto" />
                <Select label="Country" value={form.country} onChange={(event) => updateField("country", event.target.value)} options={countryOptions} />
                <Select label="Course Type" value={form.courseType} onChange={(event) => updateField("courseType", event.target.value)} options={courseTypeOptions} />
                <Select label="Ranking Level" value={form.ranking} onChange={(event) => updateField("ranking", event.target.value)} options={rankingOptions} />
                <Input label="World Ranking" type="number" min="1" step="1" value={form.worldRanking} onChange={(event) => updateField("worldRanking", event.target.value)} error={errors.worldRanking} placeholder="16" />
                <Input label="Annual Tuition Fee" type="number" min="1" step="1" value={form.tuitionFee} onChange={(event) => updateField("tuitionFee", event.target.value)} error={errors.tuitionFee} placeholder="25000" />
                <Select label="Budget Range" value={form.budgetRange} onChange={(event) => updateField("budgetRange", event.target.value)} options={budgetOptions} />
                <Input label="Application Fee" type="number" min="0" step="1" value={form.applicationFee} onChange={(event) => updateField("applicationFee", event.target.value)} error={errors.applicationFee} placeholder="120" />
                <Input label="Rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(event) => updateField("rating", event.target.value)} error={errors.rating} placeholder="4.6" />
              </div>

              <Textarea label="Programs" value={form.programs} onChange={(event) => updateField("programs", event.target.value)} placeholder="Computer Science, Engineering, Business" />
              <Textarea label="Description" value={form.description} onChange={(event) => updateField("description", event.target.value)} maxLength={2000} placeholder="Short overview of the institution, strengths, and campus experience." />
              <Input label="Image URL" value={form.imageUrl} onChange={(event) => updateField("imageUrl", event.target.value)} error={errors.imageUrl} placeholder="https://example.com/campus.jpg" />
            </Card>

            <div className="space-y-4">
              <Card>
                <h2 className="font-bold text-[#0F172A]">Publishing</h2>
                <label className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-[#E5E7EB] p-4">
                  <span>
                    <span className="block text-sm font-semibold text-[#0F172A]">Active listing</span>
                    <span className="mt-1 block text-xs text-[#64748B]">Students can see and match with this university.</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(event) => updateField("isActive", event.target.checked)}
                    className="h-5 w-5 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]"
                  />
                </label>
              </Card>

              <Card className="space-y-3">
                <Button type="submit" className="w-full" loading={saving}>
                  <Save className="h-4 w-4" />
                  Create University
                </Button>
                <Button type="button" variant="secondary" className="w-full" onClick={() => router.push("/universities")} disabled={saving}>
                  Cancel
                </Button>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AdminGuard>
  );
}
