"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { updateProfile } from "@/lib/api/auth.api";
import ProfileHeader from "@/components/profile/ProfileHeader";
import PersonalInfoCard from "@/components/profile/PersonalInfoCard";
import ReadinessCard from "@/components/profile/ReadinessCard";
import EducationCard from "@/components/profile/EducationCard";
import TestScoresCard from "@/components/profile/TestScoresCard";
import DocumentVault from "@/components/profile/DocumentVault";
import { getMyProfile } from "@/lib/api/academic-profile.api";
import type { AcademicProfile } from "@/lib/schemas/academic-profile.schema";
import { getMyDocuments, type Document } from "@/lib/api/document.api";

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

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void Promise.all([getMyProfile(), getMyDocuments()]).then(([profileResult, documentResult]) => {
        if (profileResult.success) setAcademicProfile(profileResult.data);
        if (documentResult.success) setUploadedDocuments(documentResult.data || []);
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!user) return null;

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
        <div>
          <ReadinessCard completion={completion} missingItems={missingDocuments} />
        </div>
      </div>

      {/* Education + Test Scores */}
      <div className="grid gap-6 lg:grid-cols-2">
        <EducationCard education={education} />
        <TestScoresCard scores={testScores} />
      </div>

      {/* Document Vault */}
      <DocumentVault documents={documents} />
    </div>
  );
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
