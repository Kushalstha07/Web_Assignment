
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-sm backdrop-blur-sm">
        <p className="text-sm font-medium text-slate-500">Edu Global</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
          Welcome
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Use the login or register page to continue.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Register
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
