"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ChangePasswordPage() {
  const { logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[]>
  >({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmNewPassword = formData.get("confirmNewPassword") as string;

    // Client-side validation
    const errors: Record<string, string[]> = {};
    if (!currentPassword || currentPassword.length < 1) {
      errors.currentPassword = ["Current password is required"];
    }
    if (!newPassword || newPassword.length < 6) {
      errors.newPassword = [
        "New password must be at least 6 characters long",
      ];
    }
    if (newPassword !== confirmNewPassword) {
      errors.confirmNewPassword = ["Passwords do not match"];
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/v1/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmNewPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: "Password changed successfully! You will be logged out.",
        });

        // Logout after 2 seconds
        setTimeout(async () => {
          await logout();
          router.push("/login");
        }, 2000);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to change password",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    }

    setLoading(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Change Password
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Update your account password. You will be logged out after changing.
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
        {/* Current Password */}
        <div>
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-slate-700"
          >
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 ${
              fieldErrors.currentPassword
                ? "border-red-300"
                : "border-slate-200"
            }`}
          />
          {fieldErrors.currentPassword && (
            <p className="mt-1 text-xs text-red-500">
              {fieldErrors.currentPassword[0]}
            </p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-slate-700"
          >
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 ${
              fieldErrors.newPassword ? "border-red-300" : "border-slate-200"
            }`}
          />
          {fieldErrors.newPassword && (
            <p className="mt-1 text-xs text-red-500">
              {fieldErrors.newPassword[0]}
            </p>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label
            htmlFor="confirmNewPassword"
            className="block text-sm font-medium text-slate-700"
          >
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmNewPassword"
            name="confirmNewPassword"
            className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 ${
              fieldErrors.confirmNewPassword
                ? "border-red-300"
                : "border-slate-200"
            }`}
          />
          {fieldErrors.confirmNewPassword && (
            <p className="mt-1 text-xs text-red-500">
              {fieldErrors.confirmNewPassword[0]}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Changing Password..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}