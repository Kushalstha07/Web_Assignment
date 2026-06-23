"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ProfileHeader from "@/components/profile/ProfileHeader";
import PersonalInfoCard from "@/components/profile/PersonalInfoCard";
import ReadinessCard from "@/components/profile/ReadinessCard";
import EducationCard from "@/components/profile/EducationCard";
import TestScoresCard from "@/components/profile/TestScoresCard";
import DocumentVault from "@/components/profile/DocumentVault";

export default function ProfilePage() {
  const { user } = useAuth();
  const [showEditForm, setShowEditForm] = useState(false);

  if (!user) return null;

  const completion = 85;

  const education = [
    {
      degree: "Bachelor of Science",
      institution: "Boston University",
      year: "2018 - 2020",
      scholarship: "Merit Scholarship",
    },
    {
      degree: "Master of Science",
      institution: "MIT",
      year: "2020 - 2024",
      scholarship: "Research Assistant",
    },
    {
      degree: "PhD (Current)",
      institution: "Stanford University",
      year: "2024 - Present",
    },
  ];

  const testScores = [
    { test: "IELTS", score: "8.0", validUntil: "Dec 2025" },
    { test: "GRE", score: "324", validUntil: "Oct 2026" },
    { test: "SAT", score: "1450", validUntil: "N/A" },
  ];

  const documents = [
    { name: "Passport.pdf", size: "1.2 MB", status: "Uploaded" },
    { name: "IELTS.pdf", size: "890 KB", status: "Uploaded" },
    { name: "Transcript.pdf", size: "2.4 MB", status: "Uploaded" },
    { name: "Recommendation.pdf", size: "560 KB", status: "Uploaded" },
  ];

  const missingDocuments = ["Financial Statement", "SOP"];

  if (showEditForm) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#172B4D]">Edit Profile</h1>
          <p className="mt-1 text-sm text-[#6B7280]">Update your personal information and profile picture.</p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm" style={{ boxShadow: "0px 8px 30px rgba(0,0,0,.05)" }}>
          <form className="space-y-6">
            {/* Profile Image */}
            <div>
              <label className="block text-sm font-medium text-[#172B4D]">Profile Image</label>
              <div className="mt-2 flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-[#E8EEF7] bg-slate-100">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.fullName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-2xl font-semibold text-slate-400">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="rounded-lg border border-[#E8EEF7] px-4 py-2 text-sm font-medium text-[#172B4D] transition hover:border-[#1565D8] hover:text-[#1565D8]"
                >
                  Change Photo
                </button>
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
                className="rounded-xl bg-[#1565D8] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F4DB2]"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setShowEditForm(false)}
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
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <PersonalInfoCard user={user} />
        </div>
        <div>
          <ReadinessCard completion={completion} missingItems={missingDocuments} />
        </div>
      </div>

      {/* Education + Test Scores */}
      <div className="grid grid-cols-2 gap-6">
        <EducationCard education={education} />
        <TestScoresCard scores={testScores} />
      </div>

      {/* Document Vault */}
      <DocumentVault documents={documents} />
    </div>
  );
}