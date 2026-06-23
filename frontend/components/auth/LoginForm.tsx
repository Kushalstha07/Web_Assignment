"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/auth.action";
import { useAuth } from "@/context/AuthContext";
import {
  initialAuthFormState,
  type AuthFormState,
} from "@/lib/types/auth-form.state";

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

/**
 * Set a cookie that expires 30 days from now
 */
function setClientCookie(name: string, value: string): void {
  const maxAge = 60 * 60 * 24 * 30; // 30 days
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; sameSite=lax`;
}

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

const roles = [
  { label: "Student", emoji: "🎓" },
  { label: "Consultant", emoji: "💼" },
  { label: "Admin", emoji: "⚙️" },
] as const;

export function LoginForm({
  registered,
}: {
  registered?: boolean;
}) {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [state, formAction, isPending] = useActionState<AuthFormState, FormData>(
    loginAction,
    initialAuthFormState,
  );
  const [selectedRole, setSelectedRole] = useState<string>("Student");
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);

  // When login succeeds, set the cookie client-side, refresh auth context, then navigate
  useEffect(() => {
    if (state.success && state.token) {
      setClientCookie("client-token", state.token);
      refreshUser().then(() => {
        router.push("/dashboard");
      });
    }
  }, [state.success, state.token, router, refreshUser]);

  return (
    <>
      {registered ? (
        <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Account created successfully. Please log in.
        </p>
      ) : null}

      {state.success && state.token ? (
        <p className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Login successful! Redirecting to dashboard...
        </p>
      ) : null}

      <form action={formAction} className="space-y-5">
        {/* Role Selector */}
        <div className="grid grid-cols-3 gap-2">
          {roles.map((role) => (
            <button
              key={role.label}
              type="button"
              onClick={() => setSelectedRole(role.label)}
              className={`flex flex-col items-center gap-1 rounded-xl border-2 py-3 text-center transition-all ${
                selectedRole === role.label
                  ? "border-[#1D4ED8] bg-[#1D4ED8]/5"
                  : "border-[#E2E8F0] bg-white hover:border-[#94A3B8]"
              }`}
            >
              <span className="text-lg">{role.emoji}</span>
              <span
                className={`text-xs font-semibold ${
                  selectedRole === role.label
                    ? "text-[#1D4ED8]"
                    : "text-[#64748B]"
                }`}
              >
                {role.label}
              </span>
            </button>
          ))}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-[#0F172A]">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="alex.mercer@gmail.com"
            className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15"
          />
          <FieldError errors={state.fieldErrors?.email} />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-[#0F172A]">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-[#1D4ED8] hover:underline"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <input
              ref={passwordRef}
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 pr-12 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] transition hover:text-[#64748B]"
              tabIndex={-1}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          <FieldError errors={state.fieldErrors?.password} />
        </div>

        {state.message && !state.success ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.message}
          </p>
        ) : null}

        {/* Sign In */}
        <button
          type="submit"
          disabled={isPending || (state.success && !!state.token)}
          className="relative h-12 w-full overflow-hidden rounded-xl bg-[#1D4ED8] text-sm font-bold text-white shadow-lg shadow-[#1D4ED8]/20 transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Signing in..." : "Sign In"}
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

      {/* Testimonial snippet inside card */}
      <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3">
        <p className="text-xs leading-relaxed text-[#64748B]">
          &ldquo;I received offers from 4 universities in Canada within 3
          months. EduGlobal made it happen.&rdquo;
        </p>
        <p className="mt-1 text-xs font-semibold text-[#1D4ED8]">
          — Sarah Chen, University of Toronto
        </p>
      </div>

      {/* Registration Link */}
      <p className="mt-5 text-center text-xs text-[#64748B]">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-[#1D4ED8] hover:underline"
        >
          Create an Account
        </Link>
      </p>
    </>
  );
}