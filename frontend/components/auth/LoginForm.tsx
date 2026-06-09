"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/actions/auth.action";
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

export function LoginForm({
  registered,
}: {
  registered?: boolean;
}) {
  const [state, formAction, isPending] = useActionState<AuthFormState, FormData>(
    loginAction,
    initialAuthFormState,
  );

  return (
    <>
      {registered ? (
        <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Account created successfully. Please log in.
        </p>
      ) : null}

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
            placeholder="you@example.com"
          />
          <FieldError errors={state.fieldErrors?.email} />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
            placeholder="Enter your password"
          />
          <FieldError errors={state.fieldErrors?.password} />
        </div>

        {state.message ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Signing in..." : "Login"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        No account?{" "}
        <Link
          href="/register"
          className="font-medium text-slate-900 underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </p>
    </>
  );
}
