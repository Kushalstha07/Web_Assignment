import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-[#64748B]">
          Join thousands of students who found their university match here.
        </p>
      </div>

      <RegisterForm />
    </>
  );
}