import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login",
};

type LoginPageProps = {
  searchParams: Promise<{
    registered?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <>
      <div className="mb-8">
        <p className="text-sm font-medium text-slate-500">Welcome back</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Login
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Sign in with your email and password.
        </p>
      </div>

      <LoginForm registered={params.registered === "1"} />
    </>
  );
}
