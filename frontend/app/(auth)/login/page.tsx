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
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-[#64748B]">
          Sign in to continue your applications.
        </p>
      </div>

      <LoginForm registered={params.registered === "1"} />
    </>
  );
}