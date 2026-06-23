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

  let response;
  try {
    response = await registerUser(payload);
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message:
        "Unable to connect to the server. Please make sure the backend is running on port 4000 and try again.",
    };
  }

  if (!response.success) {
    return {
      success: false,
      message: response.message || "Registration failed. Please try again.",
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

  let response;
  try {
    response = await loginUser(parsed.data);
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message:
        "Unable to connect to the server. Please make sure the backend is running on port 4000 and try again.",
    };
  }

  if (!response.success || !response.data?.token) {
    return {
      success: false,
      message: response.message || "Login failed. Please check your credentials.",
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

  // Return the token so the client can set the non-httpOnly cookie reliably
  return {
    success: true,
    token: response.data.token,
  };
}