"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginUser, registerUser } from "@/lib/api/auth.api";
import { loginSchema, registerSchema } from "@/lib/schemas/auth.schema";
import type { AuthFormState } from "@/lib/types/auth-form.state";

function formatZodErrors(
  issues: { path: PropertyKey[]; message: string }[],
): Record<string, string[]> {
  return issues.reduce<Record<string, string[]>>((errors, issue) => {
    const field = String(issue.path[0] ?? "form");
    errors[field] = [...(errors[field] ?? []), issue.message];
    return errors;
  }, {});
}

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = registerSchema.safeParse({
    fullName: formData.get("fullName"),
    username: formData.get("username"),
    email: formData.get("email"),
    phoneNumber: formData.get("phoneNumber"),
    studyLevel: formData.get("studyLevel"),
    destination: formData.get("destination"),
    fieldOfStudy: formData.get("fieldOfStudy"),
    intake: formData.get("intake"),
    budget: formData.get("budget"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    terms: formData.get("terms"),
  });

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: formatZodErrors(parsed.error.issues),
    };
  }

  const { confirmPassword: _confirmPassword, terms: _terms, ...payload } =
    parsed.data;

  const response = await registerUser(payload);

  if (!response.success) {
    return {
      success: false,
      message: response.message,
    };
  }

  redirect("/login?registered=1");
}

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: formatZodErrors(parsed.error.issues),
    };
  }

  const response = await loginUser(parsed.data);

  if (!response.success || !response.data?.token) {
    return {
      success: false,
      message: response.message || "Login failed",
    };
  }

  const cookieStore = await cookies();

  // httpOnly cookie for server-side page loads (SSR)
  cookieStore.set("token", response.data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  // Non-httpOnly companion cookie so client-side JS can read the token
  // and pass it as Authorization header for proxy API calls
  cookieStore.set("client-token", response.data.token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  redirect("/dashboard");
}