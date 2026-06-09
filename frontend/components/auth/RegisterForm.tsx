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
      <form action={formAction} className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-sm font-medium text-slate-900">Education profile</p>
          <p className="mt-1 text-sm text-slate-600">
            Share a few details so the consultancy system can suggest better
            guidance.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="fullName"
            className="text-sm font-medium text-slate-700"
          >
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
            placeholder="Your full name"
          />
          <FieldError errors={state.fieldErrors?.fullName} />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="username"
            className="text-sm font-medium text-slate-700"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
            placeholder="Choose a username"
          />
          <FieldError errors={state.fieldErrors?.username} />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="studyLevel"
            className="text-sm font-medium text-slate-700"
          >
            Current Study Level
          </label>
          <select
            id="studyLevel"
            name="studyLevel"
            defaultValue=""
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          >
            <option value="" disabled>
              Select level
            </option>
            <option value="high-school">High School</option>
            <option value="diploma">Diploma</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="postgraduate">Postgraduate</option>
          </select>
          <FieldError errors={state.fieldErrors?.studyLevel} />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="destination"
            className="text-sm font-medium text-slate-700"
          >
            Preferred Study Destination
          </label>
          <select
            id="destination"
            name="destination"
            defaultValue=""
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          >
            <option value="" disabled>
              Select country
            </option>
            <option value="usa">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="canada">Canada</option>
            <option value="australia">Australia</option>
            <option value="europe">Europe</option>
          </select>
          <FieldError errors={state.fieldErrors?.destination} />
        </div>

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
          <label htmlFor="phoneNumber" className="text-sm font-medium text-slate-700">
            Phone Number
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            autoComplete="tel"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
            placeholder="+977 9800000000"
          />
          <FieldError errors={state.fieldErrors?.phoneNumber} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="fieldOfStudy"
            className="text-sm font-medium text-slate-700"
          >
            Intended Course or Field
          </label>
          <input
            id="fieldOfStudy"
            name="fieldOfStudy"
            type="text"
            autoComplete="off"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
            placeholder="Computer Science, Business, Medicine, etc."
          />
          <FieldError errors={state.fieldErrors?.fieldOfStudy} />
        </div>

        <div className="space-y-2">
          <label htmlFor="intake" className="text-sm font-medium text-slate-700">
            Preferred Intake
          </label>
          <select
            id="intake"
            name="intake"
            defaultValue=""
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          >
            <option value="" disabled>
              Select intake
            </option>
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
            <option value="fall">Fall</option>
            <option value="winter">Winter</option>
          </select>
          <FieldError errors={state.fieldErrors?.intake} />
        </div>

        <div className="space-y-2">
          <label htmlFor="budget" className="text-sm font-medium text-slate-700">
            Budget Range
          </label>
          <select
            id="budget"
            name="budget"
            defaultValue=""
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          >
            <option value="" disabled>
              Select budget
            </option>
            <option value="under-10k">Under $10,000</option>
            <option value="10k-20k">$10,000 - $20,000</option>
            <option value="20k-35k">$20,000 - $35,000</option>
            <option value="35k-plus">Above $35,000</option>
          </select>
          <FieldError errors={state.fieldErrors?.budget} />
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
            autoComplete="new-password"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
            placeholder="Create a password"
          />
          <FieldError errors={state.fieldErrors?.password} />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-slate-700"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
            placeholder="Re-enter your password"
          />
          <FieldError errors={state.fieldErrors?.confirmPassword} />
        </div>

        <label className="md:col-span-2 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
          />
          <span>I agree to the terms and conditions.</span>
        </label>
        <FieldError errors={state.fieldErrors?.terms} />

        {state.message ? (
          <p className="md:col-span-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="md:col-span-2 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-slate-900 underline-offset-4 hover:underline"
        >
          Log in
        </Link>
      </p>
    </>
  );
}
