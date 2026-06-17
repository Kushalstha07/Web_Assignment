import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="bg-white py-[120px]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-[20px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-20 text-center md:px-16">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            Ready to start your global journey?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-300">
            Join EduGlobal today and get a personalized university matching
            report in under 5 minutes.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center rounded-[14px] bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
            >
              Create Free Account
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center rounded-[14px] border border-slate-600 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              View Demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}