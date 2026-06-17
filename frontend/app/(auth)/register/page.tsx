import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <>
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-600">Create your account</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Register
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Fill in your details to make a new account.
        </p>
      </div>

      <RegisterForm />
    </>
  );
}