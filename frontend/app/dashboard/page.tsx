import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Edu Global</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          You are logged in. Your session token is stored in an httpOnly cookie.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Register another user
          </Link>
        </div>
      </section>
    </main>
  );
}
