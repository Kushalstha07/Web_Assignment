"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Building2, Save } from "lucide-react";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { getUniversityById, updateUniversity, type CreateUniversityPayload, type University } from "@/lib/api/university.api";

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

function formFromUniversity(university: University): FormState {
  return {
    name: university.name,
    country: university.country,
    city: university.city,
    ranking: university.ranking,
    worldRanking: university.worldRanking ? String(university.worldRanking) : "",
    courseType: university.courseType,
    tuitionFee: String(university.tuitionFee),
    budgetRange: university.budgetRange,
    applicationFee: university.applicationFee !== undefined ? String(university.applicationFee) : "",
    description: university.description || "",
    programs: university.programs.join(", "),
    rating: university.rating !== undefined ? String(university.rating) : "",
    imageUrl: university.imageUrl || "",
    isActive: university.isActive,
  };
}

export default function EditUniversityPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [form, setForm] = useState<FormState | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pageError, setPageError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    const timer = window.setTimeout(() => {
      void getUniversityById(id)
        .then((response) => setForm(formFromUniversity(response.data)))
        .catch((error) => setPageError(error instanceof Error ? error.message : "Unable to load university"));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [id]);

  function updateField(name: keyof FormState, value: string | boolean) {
    setForm((current) => current ? { ...current, [name]: value } : current);
    setErrors((current) => ({ ...current, [name]: "" }));
    setPageError("");
  }

  function validate(current: FormState) {
    const nextErrors: Record<string, string> = {};
    if (!current.name.trim()) nextErrors.name = "University name is required";
    if (!current.city.trim()) nextErrors.city = "City is required";
    if (!current.tuitionFee || Number(current.tuitionFee) <= 0) nextErrors.tuitionFee = "Tuition fee must be greater than 0";
    if (current.worldRanking && Number(current.worldRanking) <= 0) nextErrors.worldRanking = "World ranking must be greater than 0";
    if (current.applicationFee && Number(current.applicationFee) < 0) nextErrors.applicationFee = "Application fee cannot be negative";
    if (current.rating && (Number(current.rating) < 0 || Number(current.rating) > 5)) nextErrors.rating = "Rating must be between 0 and 5";
    if (current.imageUrl) {
      try {
        new URL(current.imageUrl);
      } catch {
        nextErrors.imageUrl = "Enter a valid image URL";
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function buildPayload(current: FormState): CreateUniversityPayload {
    const programs = current.programs
      .split(/[\n,]/)
      .map((program) => program.trim())
      .filter(Boolean);

    return {
      name: current.name.trim(),
      country: current.country,
      city: current.city.trim(),
      ranking: current.ranking,
      ...(current.worldRanking ? { worldRanking: Number(current.worldRanking) } : {}),
      courseType: current.courseType,
      tuitionFee: Number(current.tuitionFee),
      budgetRange: current.budgetRange,
      ...(current.applicationFee ? { applicationFee: Number(current.applicationFee) } : {}),
      description: current.description.trim(),
      programs,
      ...(current.rating ? { rating: Number(current.rating) } : {}),
      ...(current.imageUrl.trim() ? { imageUrl: current.imageUrl.trim() } : {}),
      isActive: current.isActive,
    };
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form || !validate(form)) return;
    try {
      setSaving(true);
      await updateUniversity(id, buildPayload(form));
      router.push(`/universities/${id}`);
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Unable to update university");
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
              onClick={() => router.push(id ? `/universities/${id}` : "/universities")}
              className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#64748B] transition-colors hover:text-[#0F172A]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to university
            </button>
            <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Edit University</h1>
            <p className="mt-1 text-sm text-[#64748B]">Update catalog details used for discovery and recommendations.</p>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#EEF5FF]">
            <Building2 className="h-6 w-6 text-[#2563EB]" />
          </div>
        </div>

        {pageError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {pageError}
          </div>
        )}

        {!form ? (
          <Card>
            <div className="h-8 w-64 animate-pulse rounded-lg bg-[#E5E7EB]" />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {Array.from({ length: 8 }).map((_, index) => <div key={index} className="h-11 animate-pulse rounded-xl bg-[#E5E7EB]" />)}
            </div>
          </Card>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <Card className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="University Name" value={form.name} onChange={(event) => updateField("name", event.target.value)} error={errors.name} />
                  <Input label="City" value={form.city} onChange={(event) => updateField("city", event.target.value)} error={errors.city} />
                  <Select label="Country" value={form.country} onChange={(event) => updateField("country", event.target.value)} options={countryOptions} />
                  <Select label="Course Type" value={form.courseType} onChange={(event) => updateField("courseType", event.target.value)} options={courseTypeOptions} />
                  <Select label="Ranking Level" value={form.ranking} onChange={(event) => updateField("ranking", event.target.value)} options={rankingOptions} />
                  <Input label="World Ranking" type="number" min="1" step="1" value={form.worldRanking} onChange={(event) => updateField("worldRanking", event.target.value)} error={errors.worldRanking} />
                  <Input label="Annual Tuition Fee" type="number" min="1" step="1" value={form.tuitionFee} onChange={(event) => updateField("tuitionFee", event.target.value)} error={errors.tuitionFee} />
                  <Select label="Budget Range" value={form.budgetRange} onChange={(event) => updateField("budgetRange", event.target.value)} options={budgetOptions} />
                  <Input label="Application Fee" type="number" min="0" step="1" value={form.applicationFee} onChange={(event) => updateField("applicationFee", event.target.value)} error={errors.applicationFee} />
                  <Input label="Rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(event) => updateField("rating", event.target.value)} error={errors.rating} />
                </div>
                <Textarea label="Programs" value={form.programs} onChange={(event) => updateField("programs", event.target.value)} />
                <Textarea label="Description" value={form.description} onChange={(event) => updateField("description", event.target.value)} maxLength={2000} />
                <Input label="Image URL" value={form.imageUrl} onChange={(event) => updateField("imageUrl", event.target.value)} error={errors.imageUrl} />
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
                    Save Changes
                  </Button>
                  <Button type="button" variant="secondary" className="w-full" onClick={() => router.push(`/universities/${id}`)} disabled={saving}>
                    Cancel
                  </Button>
                </Card>
              </div>
            </div>
          </form>
        )}
      </div>
    </AdminGuard>
  );
}
