"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { updateProfile } from "@/lib/api/auth.api";
import ProfileHeader from "@/components/profile/ProfileHeader";
import PersonalInfoCard from "@/components/profile/PersonalInfoCard";
import ReadinessCard from "@/components/profile/ReadinessCard";
import EducationCard from "@/components/profile/EducationCard";
import TestScoresCard from "@/components/profile/TestScoresCard";
import DocumentVault from "@/components/profile/DocumentVault";
import { getMyProfile, updateProfile as updateAcademicProfile } from "@/lib/api/academic-profile.api";
import { preferredCountries, qualifications, testTypes, tuitionBudgets, type AcademicProfile } from "@/lib/schemas/academic-profile.schema";
import { getMyDocuments, uploadDocument, type Document } from "@/lib/api/document.api";
import { Button } from "@/components/ui/Button";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";

const documentCategoryOptions = [
  { value: "transcript", label: "Transcript / Marksheet" },
  { value: "degree", label: "Degree Certificate" },
  { value: "identity", label: "Passport / Identity" },
  { value: "language-test", label: "Language Test" },
  { value: "recommendation", label: "Recommendation Letter" },
  { value: "sop", label: "Statement of Purpose" },
  { value: "financial", label: "Financial Document" },
  { value: "visa", label: "Visa Document" },
  { value: "other", label: "Other" },
];

const qualificationOptions = qualifications.map((value) => ({
  value,
  label: formatOptionLabel(value),
}));

const countryOptions = preferredCountries.map((value) => ({
  value,
  label: formatCountry(value),
}));

const tuitionBudgetOptions = tuitionBudgets.map((value) => ({
  value,
  label: formatBudget(value),
}));

const testTypeOptions = [
  { value: "", label: "No test yet" },
  ...testTypes.map((value) => ({ value, label: value })),
];

type AcademicProfileFormState = {
  highestQualification: string;
  institution: string;
  graduationYear: string;
  gpa: string;
  fieldOfStudy: string;
  testType: string;
  testScore: string;
  preferredCountries: string[];
  tuitionBudget: string;
  bio: string;
};

const emptyAcademicForm: AcademicProfileFormState = {
  highestQualification: "bachelor",
  institution: "",
  graduationYear: "",
  gpa: "",
  fieldOfStudy: "",
  testType: "",
  testScore: "",
  preferredCountries: [],
  tuitionBudget: "",
  bio: "",
};

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [showEditForm, setShowEditForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [academicProfile, setAcademicProfile] = useState<AcademicProfile | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<Document[]>([]);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentCategory, setDocumentCategory] = useState("transcript");
  const [documentNotes, setDocumentNotes] = useState("");
  const [documentUploading, setDocumentUploading] = useState(false);
  const [academicEditing, setAcademicEditing] = useState(false);
  const [academicSaving, setAcademicSaving] = useState(false);
  const [academicForm, setAcademicForm] = useState<AcademicProfileFormState>(emptyAcademicForm);
  const [academicMessage, setAcademicMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (user?.role !== "student") return;
    const timer = window.setTimeout(() => {
      void Promise.all([getMyProfile(), getMyDocuments()]).then(([profileResult, documentResult]) => {
        if (profileResult.success) {
          setAcademicProfile(profileResult.data);
          setAcademicForm(toAcademicForm(profileResult.data));
        }
        if (documentResult.success) setUploadedDocuments(documentResult.data || []);
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [user?.role]);

  if (!user) return null;

  const isStudent = user.role === "student";
  const completion = academicProfile?.profileStrength ?? 0;
  const education = academicProfile ? [{ degree: academicProfile.highestQualification, institution: academicProfile.institution, year: String(academicProfile.graduationYear) }] : [];
  const testScores = academicProfile?.testType && academicProfile.testScore !== undefined ? [{ test: academicProfile.testType, score: String(academicProfile.testScore) }] : [];
  const documents = uploadedDocuments.map((item) => ({ name: item.originalName, size: formatSize(item.size), status: item.status, url: item.url }));
  const missingDocuments: string[] = [];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (selectedFile) {
      formData.set("profileImage", selectedFile);
    }

    const response = await updateProfile(formData);

    if (response.success) {
      setMessage({ type: "success", text: "Profile updated successfully!" });
      await refreshUser();
      setTimeout(() => setShowEditForm(false), 1500);
    } else {
      setMessage({
        type: "error",
        text: response.message || "Failed to update profile",
      });
    }

    setLoading(false);
  }

  async function handleDocumentUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!documentFile) {
      setMessage({ type: "error", text: "Please choose a document to upload." });
      return;
    }

    try {
      setDocumentUploading(true);
      setMessage(null);
      const response = await uploadDocument(documentFile, documentCategory, documentNotes.trim() || undefined);
      if (!response.success) throw new Error(response.message);
      setUploadedDocuments((current) => [response.data, ...current]);
      setDocumentFile(null);
      setDocumentNotes("");
      setMessage({ type: "success", text: "Document uploaded successfully. It is now pending verification." });
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Failed to upload document" });
    } finally {
      setDocumentUploading(false);
    }
  }

  async function handleAcademicSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!academicProfile) {
      setAcademicMessage({ type: "error", text: "Please complete onboarding before editing your academic profile." });
      return;
    }

    const graduationYear = Number(academicForm.graduationYear);
    const gpa = academicForm.gpa.trim() ? Number(academicForm.gpa) : undefined;
    const testScore = academicForm.testScore.trim() ? Number(academicForm.testScore) : undefined;

    if (!academicForm.institution.trim() || !academicForm.fieldOfStudy.trim() || !academicForm.graduationYear.trim()) {
      setAcademicMessage({ type: "error", text: "Please fill in qualification, institution, graduation year, and field of study." });
      return;
    }
    if (Number.isNaN(graduationYear)) {
      setAcademicMessage({ type: "error", text: "Graduation year must be a valid number." });
      return;
    }
    if (academicForm.gpa.trim() && (gpa === undefined || Number.isNaN(gpa) || gpa < 0 || gpa > 4)) {
      setAcademicMessage({ type: "error", text: "GPA must be between 0 and 4." });
      return;
    }
    if (Boolean(academicForm.testType) !== (testScore !== undefined)) {
      setAcademicMessage({ type: "error", text: "Test type and score must be filled together." });
      return;
    }

    const testLimits = { IELTS: 9, TOEFL: 120, GRE: 340, GMAT: 800 } as const;
    if (academicForm.testType && testScore !== undefined && testScore > testLimits[academicForm.testType as keyof typeof testLimits]) {
      setAcademicMessage({ type: "error", text: `${academicForm.testType} score cannot exceed ${testLimits[academicForm.testType as keyof typeof testLimits]}.` });
      return;
    }

    try {
      setAcademicSaving(true);
      setAcademicMessage(null);
      const response = await updateAcademicProfile({
        highestQualification: academicForm.highestQualification as AcademicProfile["highestQualification"],
        institution: academicForm.institution.trim(),
        graduationYear,
        ...(gpa !== undefined ? { gpa } : {}),
        fieldOfStudy: academicForm.fieldOfStudy.trim(),
        ...(academicForm.testType ? { testType: academicForm.testType as AcademicProfile["testType"] } : {}),
        ...(testScore !== undefined ? { testScore } : {}),
        preferredCountries: academicForm.preferredCountries,
        ...(academicForm.tuitionBudget ? { tuitionBudget: academicForm.tuitionBudget } : {}),
        bio: academicForm.bio.trim(),
      });

      if (!response.success) throw new Error(response.message);
      setAcademicProfile(response.data);
      setAcademicEditing(false);
      setAcademicMessage({ type: "success", text: "Academic profile updated successfully." });
    } catch (error) {
      setAcademicMessage({ type: "error", text: error instanceof Error ? error.message : "Failed to update academic profile" });
    } finally {
      setAcademicSaving(false);
    }
  }

  if (showEditForm) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#172B4D]">Edit Profile</h1>
          <p className="mt-1 text-sm text-[#6B7280]">Update your personal information and profile picture.</p>
        </div>

        {message && (
          <div
            className={`mb-4 rounded-lg p-3 text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="rounded-2xl bg-white p-8 shadow-sm" style={{ boxShadow: "0px 8px 30px rgba(0,0,0,.05)" }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div>
              <label className="block text-sm font-medium text-[#172B4D]">Profile Image</label>
              <div className="mt-2 flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-[#E8EEF7] bg-slate-100">
                  {previewUrl ? (
                    <Image src={previewUrl} alt="Preview" fill sizes="80px" unoptimized className="object-cover" />
                  ) : user.profileImage ? (
                    <Image src={user.profileImage} alt={user.fullName} fill sizes="80px" unoptimized className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-2xl font-semibold text-slate-400">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="profileImage"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setPreviewUrl(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg border border-[#E8EEF7] px-4 py-2 text-sm font-medium text-[#172B4D] transition hover:border-[#1565D8] hover:text-[#1565D8]"
                  >
                    Change Photo
                  </button>
                  {selectedFile && (
                    <p className="mt-1 text-xs text-[#6B7280]">{selectedFile.name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-[#172B4D]">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                defaultValue={user.fullName}
                className="mt-1 block w-full rounded-lg border border-[#E8EEF7] bg-white px-4 py-2.5 text-sm text-[#172B4D] outline-none transition focus:border-[#1565D8] focus:ring-2 focus:ring-[#1565D8]/10"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-[#172B4D]">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                defaultValue={user.phoneNumber}
                className="mt-1 block w-full rounded-lg border border-[#E8EEF7] bg-white px-4 py-2.5 text-sm text-[#172B4D] outline-none transition focus:border-[#1565D8] focus:ring-2 focus:ring-[#1565D8]/10"
              />
            </div>

            {isStudent && (
              <>
                {/* Study Level */}
                <div>
                  <label htmlFor="studyLevel" className="block text-sm font-medium text-[#172B4D]">Study Level</label>
                  <select
                    id="studyLevel"
                    name="studyLevel"
                    defaultValue={user.studyLevel}
                    className="mt-1 block w-full rounded-lg border border-[#E8EEF7] bg-white px-4 py-2.5 text-sm text-[#172B4D] outline-none transition focus:border-[#1565D8] focus:ring-2 focus:ring-[#1565D8]/10"
                  >
                    <option value="high-school">High School</option>
                    <option value="diploma">Diploma</option>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="postgraduate">Postgraduate</option>
                  </select>
                </div>

                {/* Destination */}
                <div>
                  <label htmlFor="destination" className="block text-sm font-medium text-[#172B4D]">Preferred Destination</label>
                  <select
                    id="destination"
                    name="destination"
                    defaultValue={user.destination}
                    className="mt-1 block w-full rounded-lg border border-[#E8EEF7] bg-white px-4 py-2.5 text-sm text-[#172B4D] outline-none transition focus:border-[#1565D8] focus:ring-2 focus:ring-[#1565D8]/10"
                  >
                    <option value="usa">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="canada">Canada</option>
                    <option value="australia">Australia</option>
                    <option value="europe">Europe</option>
                  </select>
                </div>

                {/* Field of Study */}
                <div>
                  <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-[#172B4D]">Field of Study</label>
                  <input
                    type="text"
                    id="fieldOfStudy"
                    name="fieldOfStudy"
                    defaultValue={user.fieldOfStudy}
                    className="mt-1 block w-full rounded-lg border border-[#E8EEF7] bg-white px-4 py-2.5 text-sm text-[#172B4D] outline-none transition focus:border-[#1565D8] focus:ring-2 focus:ring-[#1565D8]/10"
                  />
                </div>

                {/* Intake */}
                <div>
                  <label htmlFor="intake" className="block text-sm font-medium text-[#172B4D]">Preferred Intake</label>
                  <select
                    id="intake"
                    name="intake"
                    defaultValue={user.intake}
                    className="mt-1 block w-full rounded-lg border border-[#E8EEF7] bg-white px-4 py-2.5 text-sm text-[#172B4D] outline-none transition focus:border-[#1565D8] focus:ring-2 focus:ring-[#1565D8]/10"
                  >
                    <option value="spring">Spring</option>
                    <option value="summer">Summer</option>
                    <option value="fall">Fall</option>
                    <option value="winter">Winter</option>
                  </select>
                </div>

                {/* Budget */}
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-[#172B4D]">Budget Range</label>
                  <select
                    id="budget"
                    name="budget"
                    defaultValue={user.budget}
                    className="mt-1 block w-full rounded-lg border border-[#E8EEF7] bg-white px-4 py-2.5 text-sm text-[#172B4D] outline-none transition focus:border-[#1565D8] focus:ring-2 focus:ring-[#1565D8]/10"
                  >
                    <option value="under-10k">Under $10,000</option>
                    <option value="10k-20k">$10,000 - $20,000</option>
                    <option value="20k-35k">$20,000 - $35,000</option>
                    <option value="35k-plus">Above $35,000</option>
                  </select>
                </div>
              </>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-[#1565D8] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F4DB2] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEditForm(false);
                  setMessage(null);
                }}
                className="rounded-xl border border-[#E8EEF7] px-6 py-2.5 text-sm font-semibold text-[#172B4D] transition hover:border-[#1565D8] hover:text-[#1565D8]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] space-y-6">
      {/* Profile Header */}
      <ProfileHeader
        user={{
          fullName: user.fullName,
          profileImage: user.profileImage,
          role: user.role,
          studyLevel: user.studyLevel,
          destination: user.destination,
        }}
        completion={completion}
        onEdit={() => setShowEditForm(true)}
      />

      {/* Personal Info + Readiness */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PersonalInfoCard user={user} />
        </div>
        {isStudent && (
          <div>
            <ReadinessCard completion={completion} missingItems={missingDocuments} />
          </div>
        )}
      </div>

      {isStudent && (
        <>
          {/* Education + Test Scores */}
          <div className="grid gap-6 lg:grid-cols-2">
            <EducationCard education={education} />
            <TestScoresCard scores={testScores} />
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm" style={{ boxShadow: "0px 8px 30px rgba(0,0,0,.05)" }}>
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-[#172B4D]">Academic Profile</h3>
                <p className="mt-1 text-sm text-[#6B7280]">Keep your education, test, and study preferences up to date.</p>
              </div>
              {academicProfile && !academicEditing && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setAcademicForm(toAcademicForm(academicProfile));
                    setAcademicMessage(null);
                    setAcademicEditing(true);
                  }}
                >
                  Edit Academic Profile
                </Button>
              )}
            </div>

            {academicMessage && (
              <div className={`mb-4 rounded-xl p-3 text-sm ${academicMessage.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {academicMessage.text}
              </div>
            )}

            {!academicProfile ? (
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#F59E0B]/30 bg-[#FFF9EE] p-4">
                <p className="text-sm font-medium text-[#92400E]">Complete onboarding first, then you can edit your academic profile here anytime.</p>
                <Link href="/onboarding/step-1" className="rounded-xl bg-[#F59E0B] px-4 py-2 text-sm font-semibold text-white">
                  Start Onboarding
                </Link>
              </div>
            ) : academicEditing ? (
              <form onSubmit={handleAcademicSubmit} className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <Select
                    label="Highest Qualification"
                    value={academicForm.highestQualification}
                    onChange={(event) => setAcademicForm((current) => ({ ...current, highestQualification: event.target.value }))}
                    options={qualificationOptions}
                  />
                  <Input
                    label="Institution"
                    value={academicForm.institution}
                    onChange={(event) => setAcademicForm((current) => ({ ...current, institution: event.target.value }))}
                  />
                  <Input
                    label="Graduation Year"
                    type="number"
                    min={1990}
                    max={new Date().getFullYear() + 5}
                    value={academicForm.graduationYear}
                    onChange={(event) => setAcademicForm((current) => ({ ...current, graduationYear: event.target.value }))}
                  />
                  <Input
                    label="Field of Study"
                    value={academicForm.fieldOfStudy}
                    onChange={(event) => setAcademicForm((current) => ({ ...current, fieldOfStudy: event.target.value }))}
                  />
                  <Input
                    label="GPA"
                    type="number"
                    min={0}
                    max={4}
                    step="0.01"
                    value={academicForm.gpa}
                    onChange={(event) => setAcademicForm((current) => ({ ...current, gpa: event.target.value }))}
                  />
                  <Select
                    label="Test Type"
                    value={academicForm.testType}
                    onChange={(event) => setAcademicForm((current) => ({ ...current, testType: event.target.value }))}
                    options={testTypeOptions}
                  />
                  <Input
                    label="Test Score"
                    type="number"
                    min={0}
                    max={800}
                    value={academicForm.testScore}
                    onChange={(event) => setAcademicForm((current) => ({ ...current, testScore: event.target.value }))}
                  />
                  <Select
                    label="Tuition Budget"
                    value={academicForm.tuitionBudget}
                    onChange={(event) => setAcademicForm((current) => ({ ...current, tuitionBudget: event.target.value }))}
                    options={tuitionBudgetOptions}
                    placeholder="Select budget"
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-[#0F172A]">Preferred Countries</p>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                    {countryOptions.map((country) => {
                      const checked = academicForm.preferredCountries.includes(country.value);
                      return (
                        <label key={country.value} className="flex min-h-11 items-center gap-2 rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm font-medium text-[#172B4D]">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(event) => {
                              setAcademicForm((current) => ({
                                ...current,
                                preferredCountries: event.target.checked
                                  ? [...current.preferredCountries, country.value]
                                  : current.preferredCountries.filter((value) => value !== country.value),
                              }));
                            }}
                            className="h-4 w-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]"
                          />
                          {country.label}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <Textarea
                  label="Bio"
                  value={academicForm.bio}
                  onChange={(event) => setAcademicForm((current) => ({ ...current, bio: event.target.value }))}
                  maxLength={500}
                  placeholder="Tell counsellors about your study goals"
                />

                <div className="flex flex-wrap justify-end gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setAcademicForm(toAcademicForm(academicProfile));
                      setAcademicEditing(false);
                      setAcademicMessage(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" loading={academicSaving}>
                    Save Academic Profile
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <ProfileDetail label="Preferred Countries" value={(academicProfile.preferredCountries || []).map(formatCountry).join(", ") || "Not selected"} />
                <ProfileDetail label="Tuition Budget" value={academicProfile.tuitionBudget ? formatBudget(academicProfile.tuitionBudget) : "Not selected"} />
                <ProfileDetail label="Field of Study" value={academicProfile.fieldOfStudy} />
                <ProfileDetail label="Last Updated" value={academicProfile.updatedAt ? new Date(academicProfile.updatedAt).toLocaleDateString() : "Recently"} />
                {academicProfile.bio && (
                  <div className="md:col-span-2 lg:col-span-4">
                    <ProfileDetail label="Bio" value={academicProfile.bio} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Document Vault */}
          {message && (
            <div className={`rounded-xl p-4 text-sm ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {message.text}
            </div>
          )}
          <div className="rounded-2xl bg-white p-6 shadow-sm" style={{ boxShadow: "0px 8px 30px rgba(0,0,0,.05)" }}>
            <div className="mb-5">
              <h3 className="text-lg font-bold text-[#172B4D]">Upload Documents</h3>
              <p className="mt-1 text-sm text-[#6B7280]">Add transcripts, identity documents, test results, financial documents, or SOP files.</p>
            </div>
            <form onSubmit={handleDocumentUpload} className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <Select
                  label="Document Category"
                  value={documentCategory}
                  onChange={(event) => setDocumentCategory(event.target.value)}
                  options={documentCategoryOptions}
                />
                <Textarea
                  label="Notes (optional)"
                  value={documentNotes}
                  onChange={(event) => setDocumentNotes(event.target.value)}
                  maxLength={500}
                  placeholder="Add context for your counsellor or admin reviewer"
                />
              </div>
              <FileDropzone
                accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,image/jpeg,image/png,image/webp"
                maxSize={10 * 1024 * 1024}
                onFilesSelected={(files) => setDocumentFile(files[0] || null)}
                label="Drag & drop your document here, or click to browse"
              />
              <div className="flex justify-end">
                <Button type="submit" loading={documentUploading} disabled={!documentFile || documentUploading}>
                  Upload Document
                </Button>
              </div>
            </form>
          </div>
          <DocumentVault documents={documents} />
        </>
      )}
    </div>
  );
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function toAcademicForm(profile: AcademicProfile): AcademicProfileFormState {
  return {
    highestQualification: profile.highestQualification,
    institution: profile.institution || "",
    graduationYear: profile.graduationYear ? String(profile.graduationYear) : "",
    gpa: profile.gpa !== undefined ? String(profile.gpa) : "",
    fieldOfStudy: profile.fieldOfStudy || "",
    testType: profile.testType || "",
    testScore: profile.testScore !== undefined ? String(profile.testScore) : "",
    preferredCountries: profile.preferredCountries || [],
    tuitionBudget: profile.tuitionBudget || "",
    bio: profile.bio || "",
  };
}

function ProfileDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#E8EEF7] bg-[#F8FAFC] p-4">
      <p className="text-xs font-semibold uppercase text-[#64748B]">{label}</p>
      <p className="mt-2 text-sm font-semibold text-[#172B4D]">{value}</p>
    </div>
  );
}

function formatOptionLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatCountry(value: string) {
  const labels: Record<string, string> = {
    usa: "United States",
    uk: "United Kingdom",
    canada: "Canada",
    australia: "Australia",
    europe: "Europe",
  };
  return labels[value] || formatOptionLabel(value);
}

function formatBudget(value: string) {
  const labels: Record<string, string> = {
    "under-10k": "Under $10,000",
    "10k-20k": "$10,000 - $20,000",
    "20k-35k": "$20,000 - $35,000",
    "35k-plus": "Above $35,000",
  };
  return labels[value] || value;
}
