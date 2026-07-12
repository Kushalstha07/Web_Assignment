"use client";

import { useState } from "react";
import type { AdminUser, AdminCreateUserPayload, AdminUpdateUserPayload } from "@/lib/api/types";

const studyLevels = ["high-school", "diploma", "undergraduate", "postgraduate"] as const;
const destinations = ["usa", "uk", "canada", "australia", "europe"] as const;
const intakes = ["spring", "summer", "fall", "winter"] as const;
const budgets = ["under-10k", "10k-20k", "20k-35k", "35k-plus"] as const;

interface UserFormProps {
  user?: AdminUser | null;
  onSave: (data: AdminCreateUserPayload | AdminUpdateUserPayload) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

export function UserForm({ user, onSave, onCancel, isSaving }: UserFormProps) {
  const isEdit = !!user;

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    username: user?.username || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    studyLevel: user?.studyLevel || "",
    destination: user?.destination || "",
    fieldOfStudy: user?.fieldOfStudy || "",
    intake: user?.intake || "",
    budget: user?.budget || "",
    password: "",
    role: user?.role || "student" as "admin" | "counsellor" | "student",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email format";
    if (!form.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!form.studyLevel) newErrors.studyLevel = "Study level is required";
    if (!form.destination) newErrors.destination = "Destination is required";
    if (!form.fieldOfStudy.trim()) newErrors.fieldOfStudy = "Field of study is required";
    if (!form.intake) newErrors.intake = "Intake is required";
    if (!form.budget) newErrors.budget = "Budget is required";
    if (!isEdit && !form.password) newErrors.password = "Password is required";
    if (form.password && form.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    if (isEdit) {
      const payload: AdminUpdateUserPayload = {};
      for (const key of Object.keys(form) as (keyof typeof form)[]) {
        if (key === "password") {
          if (form.password) payload.password = form.password;
        } else if (form[key] !== user![key as keyof AdminUser] && form[key] !== "") {
          (payload as any)[key] = form[key];
        }
      }
      await onSave(payload);
    } else {
      await onSave(form as AdminCreateUserPayload);
    }
  }

  const inputClass = "h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15";
  const selectClass = inputClass;
  const labelClass = "text-xs font-semibold text-[#0F172A]";
  const errorClass = "text-xs text-red-600 mt-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0F172A]">
            {isEdit ? "Edit User" : "Create User"}
          </h2>
          <button
            onClick={onCancel}
            className="rounded-lg p-1 text-[#64748B] hover:bg-[#F1F5F9]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Full Name */}
            <div className="space-y-1">
              <label className={labelClass}>Full Name</label>
              <input name="fullName" value={form.fullName} onChange={handleChange} className={inputClass} placeholder="Full name" />
              {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
            </div>

            {/* Username */}
            <div className="space-y-1">
              <label className={labelClass}>Username</label>
              <input name="username" value={form.username} onChange={handleChange} className={inputClass} placeholder="Username" />
              {errors.username && <p className={errorClass}>{errors.username}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className={labelClass}>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="Email" />
              {errors.email && <p className={errorClass}>{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className={labelClass}>Phone</label>
              <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className={inputClass} placeholder="Phone number" />
              {errors.phoneNumber && <p className={errorClass}>{errors.phoneNumber}</p>}
            </div>

            {/* Study Level */}
            <div className="space-y-1">
              <label className={labelClass}>Study Level</label>
              <select name="studyLevel" value={form.studyLevel} onChange={handleChange} className={selectClass}>
                <option value="" disabled>Select level</option>
                {studyLevels.map((s) => <option key={s} value={s}>{s.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>)}
              </select>
              {errors.studyLevel && <p className={errorClass}>{errors.studyLevel}</p>}
            </div>

            {/* Destination */}
            <div className="space-y-1">
              <label className={labelClass}>Destination</label>
              <select name="destination" value={form.destination} onChange={handleChange} className={selectClass}>
                <option value="" disabled>Select country</option>
                {destinations.map((d) => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
              </select>
              {errors.destination && <p className={errorClass}>{errors.destination}</p>}
            </div>

            {/* Field of Study */}
            <div className="space-y-1">
              <label className={labelClass}>Field of Study</label>
              <input name="fieldOfStudy" value={form.fieldOfStudy} onChange={handleChange} className={inputClass} placeholder="e.g. Computer Science" />
              {errors.fieldOfStudy && <p className={errorClass}>{errors.fieldOfStudy}</p>}
            </div>

            {/* Intake */}
            <div className="space-y-1">
              <label className={labelClass}>Intake</label>
              <select name="intake" value={form.intake} onChange={handleChange} className={selectClass}>
                <option value="" disabled>Select intake</option>
                {intakes.map((i) => <option key={i} value={i}>{i.charAt(0).toUpperCase() + i.slice(1)}</option>)}
              </select>
              {errors.intake && <p className={errorClass}>{errors.intake}</p>}
            </div>

            {/* Budget */}
            <div className="space-y-1">
              <label className={labelClass}>Budget</label>
              <select name="budget" value={form.budget} onChange={handleChange} className={selectClass}>
                <option value="" disabled>Select budget</option>
                <option value="under-10k">Under $10,000</option>
                <option value="10k-20k">$10,000 - $20,000</option>
                <option value="20k-35k">$20,000 - $35,000</option>
                <option value="35k-plus">Above $35,000</option>
              </select>
              {errors.budget && <p className={errorClass}>{errors.budget}</p>}
            </div>

            {/* Role */}
            <div className="space-y-1">
              <label className={labelClass}>Role</label>
              <select name="role" value={form.role} onChange={handleChange} className={selectClass}>
                <option value="student">Student</option>
                <option value="counsellor">Counsellor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className={labelClass}>{isEdit ? "New Password (leave blank to keep)" : "Password"}</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} className={inputClass} placeholder={isEdit ? "Leave blank to keep current" : "Password"} />
              {errors.password && <p className={errorClass}>{errors.password}</p>}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="h-12 rounded-xl border border-[#E2E8F0] bg-white px-6 text-sm font-semibold text-[#64748B] transition-all hover:bg-[#F8FAFC] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="h-12 rounded-xl bg-[#1D4ED8] px-6 text-sm font-bold text-white shadow-lg shadow-[#1D4ED8]/20 transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? "Saving..." : isEdit ? "Update User" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}