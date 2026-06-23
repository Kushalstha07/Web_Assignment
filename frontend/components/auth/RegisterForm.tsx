"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "@/actions/auth.action";
import {
  initialAuthFormState,
  type AuthFormState,
} from "@/lib/types/auth-form.state";

function FieldError({
  errors,
}: {
  errors?: string[];
}) {
  if (!errors?.length) {
    return null;
  }

  return <p className="text-sm text-red-600">{errors[0]}</p>;
}

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState<AuthFormState, FormData>(
    registerAction,
    initialAuthFormState,
  );

  return (
    <>
      <form action={formAction} className="space-y-4">
        {/* Education Profile Banner */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3">
          <p className="text-sm font-semibold text-[#0F172A]">
            Education profile
          </p>
          <p className="mt-0.5 text-xs text-[#64748B]">
            Share a few details so we can suggest better guidance.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0F172A]">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15"
            />
            <FieldError errors={state.fieldErrors?.fullName} />
          </div>

          {/* Username */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0F172A]">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Choose a username"
              className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15"
            />
            <FieldError errors={state.fieldErrors?.username} />
          </div>

          {/* Study Level */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0F172A]">Study Level</label>
            <select
              id="studyLevel"
              name="studyLevel"
              defaultValue=""
              className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] outline-none transition focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15"
            >
              <option value="" disabled>Select level</option>
              <option value="high-school">High School</option>
              <option value="diploma">Diploma</option>
              <option value="undergraduate">Undergraduate</option>
              <option value="postgraduate">Postgraduate</option>
            </select>
            <FieldError errors={state.fieldErrors?.studyLevel} />
          </div>

          {/* Destination */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0F172A]">Destination</label>
            <select
              id="destination"
              name="destination"
              defaultValue=""
              className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] outline-none transition focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15"
            >
              <option value="" disabled>Select country</option>
              <option value="usa">United States</option>
              <option value="uk">United Kingdom</option>
              <option value="canada">Canada</option>
              <option value="australia">Australia</option>
              <option value="europe">Europe</option>
            </select>
            <FieldError errors={state.fieldErrors?.destination} />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0F172A]">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15"
            />
            <FieldError errors={state.fieldErrors?.email} />
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0F172A]">Phone</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              autoComplete="tel"
              placeholder="+977 9800000000"
              className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15"
            />
            <FieldError errors={state.fieldErrors?.phoneNumber} />
          </div>

          {/* Field of Study */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-semibold text-[#0F172A]">Intended Course</label>
            <input
              id="fieldOfStudy"
              name="fieldOfStudy"
              type="text"
              autoComplete="off"
              placeholder="Computer Science, Business, Medicine, etc."
              className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15"
            />
            <FieldError errors={state.fieldErrors?.fieldOfStudy} />
          </div>

          {/* Intake */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0F172A]">Intake</label>
            <select
              id="intake"
              name="intake"
              defaultValue=""
              className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] outline-none transition focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15"
            >
              <option value="" disabled>Select intake</option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="fall">Fall</option>
              <option value="winter">Winter</option>
            </select>
            <FieldError errors={state.fieldErrors?.intake} />
          </div>

          {/* Budget */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0F172A]">Budget Range</label>
            <select
              id="budget"
              name="budget"
              defaultValue=""
              className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] outline-none transition focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15"
            >
              <option value="" disabled>Select budget</option>
              <option value="under-10k">Under $10,000</option>
              <option value="10k-20k">$10,000 - $20,000</option>
              <option value="20k-35k">$20,000 - $35,000</option>
              <option value="35k-plus">Above $35,000</option>
            </select>
            <FieldError errors={state.fieldErrors?.budget} />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0F172A]">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15"
            />
            <FieldError errors={state.fieldErrors?.password} />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0F172A]">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15"
            />
            <FieldError errors={state.fieldErrors?.confirmPassword} />
          </div>
        </div>

        {/* Terms */}
        <label className="flex items-start gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-xs text-[#64748B]">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-[#CBD5E1] text-[#1D4ED8] focus:ring-[#1D4ED8]"
          />
          <span>I agree to the terms and conditions.</span>
        </label>
        <FieldError errors={state.fieldErrors?.terms} />

        {state.message ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.message}
          </p>
        ) : null}

        {/* Register Button */}
        <button
          type="submit"
          disabled={isPending}
          className="relative h-12 w-full overflow-hidden rounded-xl bg-[#1D4ED8] text-sm font-bold text-white shadow-lg shadow-[#1D4ED8]/20 transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Creating account..." : "Register"}
        </button>

        {/* Divider */}
        <div className="relative flex items-center gap-3">
          <div className="flex-1 border-t border-[#E2E8F0]" />
          <span className="text-xs font-semibold uppercase tracking-[1px] text-[#94A3B8]">
            Or continue with
          </span>
          <div className="flex-1 border-t border-[#E2E8F0]" />
        </div>

        {/* Social */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white text-sm font-semibold text-[#0F172A] transition-all hover:bg-[#F8FAFC]"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M43.611 20.083H42V20H24V28H35.303C33.654 33.284 28.852 37 24 37C17.373 37 12 31.627 12 25C12 18.373 17.373 13 24 13C27.059 13 29.839 14.155 31.977 16.023L37.632 10.368C34.096 7.086 29.406 5 24 5C12.954 5 4 13.954 4 25C4 36.046 12.954 45 24 45C35.046 45 44 36.046 44 25C44 23.659 43.862 22.35 43.611 20.083Z" fill="#FFC107"/>
              <path d="M6.306 15.691L12.877 20.619C14.655 15.584 19.152 12 24 12C27.059 12 29.839 13.155 31.977 15.023L37.632 9.368C34.096 6.086 29.406 4 24 4C16.318 4 9.656 8.656 6.306 15.691Z" fill="#FF3D00"/>
              <path d="M24 44C29.166 44 33.86 42.076 37.342 39.032L31.186 33.788C29.299 35.311 26.792 36.358 24 36.999C19.037 36.999 14.605 34.121 12.767 29.131L6.216 34.168C9.712 41.089 16.47 44 24 44Z" fill="#4CAF50"/>
              <path d="M44 24C44 22.659 43.862 21.35 43.611 19.083H42V20H24V28H35.303C34.07 32.176 30.841 35.295 27.204 36.964L27.303 37L33.303 43.5C33.4 43.5 44 35.5 44 24Z" fill="#1976D2"/>
            </svg>
            Google
          </button>
          <button
            type="button"
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white text-sm font-semibold text-[#0F172A] transition-all hover:bg-[#F8FAFC]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#0F172A" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 3.5c.29.22.544.528.735.89.19.362.296.71.296 1.098 0 .39-.106.74-.296 1.098-.19.358-.445.666-.735.888-.29.222-.585.333-.886.333-.3 0-.594-.111-.886-.333-.292-.222-.549-.53-.735-.888a2.636 2.636 0 01-.296-1.098c0-.387.103-.736.296-1.098.19-.362.446-.67.735-.89.29-.22.586-.332.886-.332.3 0 .595.111.886.332zm-7.3 11.35c-.34.75-.87 1.55-1.57 2.4-.7.85-1.48 1.56-2.34 2.13-.86.57-1.73.86-2.58.86-.79 0-1.38-.25-1.78-.75-.43-.5-.62-1.24-.62-2.22 0-1.02.2-2.21.6-3.56.4-1.35.93-2.72 1.59-4.11.66-1.39 1.37-2.64 2.14-3.74.77-1.1 1.63-2.05 2.56-2.84.52-.44 1.07-.75 1.65-.94s1.1-.27 1.55-.27c.59 0 1.09.12 1.51.36.42.24.76.55 1.01.93a2.9 2.9 0 01.5 1.17c.1.44.15.88.15 1.32 0 .49-.07.96-.2 1.42-.13.46-.3.88-.52 1.26s-.44.64-.67.92c-.23.28-.4.52-.5.72-.4.74-.39 1.36-.39 1.86h6.05c0 .16-.02.34-.05.54-.03.2-.08.42-.14.66-.06.24-.14.5-.24.78a9.99 9.99 0 01-2.95 4.68c-.33.3-.77.68-1.31 1.15-.54.47-1.02.86-1.43 1.17-.41.31-.72.54-.94.69l-.34.22c-.07.04-.12.07-.15.1l-.1.08c.1.1.22.18.36.26.14.08.3.15.48.21.18.06.37.1.57.13.2.03.39.05.59.05.38 0 .75-.04 1.11-.13.36-.09.7-.2 1.02-.35.48-.22.96-.52 1.44-.88.48-.36.94-.76 1.38-1.2.44-.44.86-.9 1.26-1.38l1.58 1.14c-.4.6-.86 1.18-1.38 1.74-.52.56-1.06 1.07-1.62 1.53-.56.46-1.12.85-1.68 1.17-.56.32-1.12.56-1.68.72-.56.16-1.12.24-1.67.24-.8 0-1.57-.14-2.32-.42-.75-.28-1.42-.7-2-1.26-.58-.56-1.06-1.26-1.44-2.1-.38-.84-.57-1.82-.57-2.94 0-.88.13-1.78.39-2.7.26-.92.61-1.82 1.05-2.7.44-.88.95-1.74 1.53-2.58.58-.84 1.18-1.6 1.8-2.28.62-.68 1.24-1.26 1.86-1.74.62-.48 1.2-.84 1.74-1.08z"/>
            </svg>
            Apple
          </button>
        </div>
      </form>

      {/* Login Link */}
      <p className="mt-5 text-center text-xs text-[#64748B]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#1D4ED8] hover:underline"
        >
          Log in
        </Link>
      </p>
    </>
  );
}