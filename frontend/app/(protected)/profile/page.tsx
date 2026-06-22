"use client";

import { useAuth } from "@/context/AuthContext";
import { updateProfile } from "@/lib/api/auth.api";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  studyLevels,
  destinations,
  intakes,
  budgets,
} from "@/lib/schemas/auth.schema";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // If no file selected, remove the file field from formData
    if (!selectedFile) {
      formData.delete("profileImage");
    }

    const response = await updateProfile(formData);

    if (response.success) {
      setMessage({ type: "success", text: "Profile updated successfully!" });
      await refreshUser();
      setSelectedFile(null);
      setPreviewUrl(null);
    } else {
      setMessage({
        type: "error",
        text: response.message || "Failed to update profile",
      });
    }

    setLoading(false);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  if (!user) return null;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Update Profile
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Update your personal information and profile picture.
      </p>

      {message && (
        <div
          className={`mt-4 rounded-lg p-3 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Profile Image
          </label>
          <div className="mt-2 flex items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              ) : user.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt={user.fullName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-2xl font-semibold text-slate-400">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Change Photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              name="profileImage"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            defaultValue={user.fullName}
            className="mt-1 block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            defaultValue={user.phoneNumber}
            className="mt-1 block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
        </div>

        {/* Study Level */}
        <div>
          <label htmlFor="studyLevel" className="block text-sm font-medium text-slate-700">
            Study Level
          </label>
          <select
            id="studyLevel"
            name="studyLevel"
            defaultValue={user.studyLevel}
            className="mt-1 block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          >
            {studyLevels.map((level) => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1).replace("-", " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Destination */}
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-slate-700">
            Preferred Destination
          </label>
          <select
            id="destination"
            name="destination"
            defaultValue={user.destination}
            className="mt-1 block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          >
            {destinations.map((dest) => (
              <option key={dest} value={dest}>
                {dest.charAt(0).toUpperCase() + dest.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Field of Study */}
        <div>
          <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-slate-700">
            Field of Study
          </label>
          <input
            type="text"
            id="fieldOfStudy"
            name="fieldOfStudy"
            defaultValue={user.fieldOfStudy}
            className="mt-1 block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
        </div>

        {/* Intake */}
        <div>
          <label htmlFor="intake" className="block text-sm font-medium text-slate-700">
            Preferred Intake
          </label>
          <select
            id="intake"
            name="intake"
            defaultValue={user.intake}
            className="mt-1 block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          >
            {intakes.map((intake) => (
              <option key={intake} value={intake}>
                {intake.charAt(0).toUpperCase() + intake.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Budget */}
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-slate-700">
            Budget Range
          </label>
          <select
            id="budget"
            name="budget"
            defaultValue={user.budget}
            className="mt-1 block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          >
            {budgets.map((b) => (
              <option key={b} value={b}>
                {b.replace("-", " - ").replace("k", "K")}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="reset"
            onClick={() => {
              setSelectedFile(null);
              setPreviewUrl(null);
              setMessage(null);
            }}
            className="rounded-lg border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Reset
          </button>
          <Link
            href="/change-password"
            className="ml-auto rounded-lg border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Change Password
          </Link>
        </div>
      </form>
    </div>
  );
}