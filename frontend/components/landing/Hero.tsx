import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pb-20 pt-16 md:pt-20">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column */}
          <div className="max-w-xl">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 1L10 5.5L15 6L11.5 9.5L12.5 15L8 12L3.5 15L4.5 9.5L1 6L6 5.5L8 1Z"
                  fill="#2563EB"
                />
              </svg>
              Accelerate Your Academic Journey
            </div>

            {/* Headline */}
            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
              Find the right university{" "}
              <span className="text-blue-600">based on your profile</span>
            </h1>

            {/* Supporting text */}
            <p className="mt-6 text-lg leading-relaxed text-slate-500">
              EduGlobal uses intelligent matching technology to connect
              students with their ideal global education paths. Simplify your
              application and secure your future.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-[14px] bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
              >
                Get Started
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 8H13M13 8L9 4M13 8L9 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <Link
                href="/universities"
                className="inline-flex items-center rounded-[14px] border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50"
              >
                Explore Universities
              </Link>
            </div>

            {/* Avatar stack + stats */}
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-3">
                {["#2563EB", "#0F172A", "#64748B", "#E2E8F0"].map(
                  (color, i) => (
                    <div
                      key={i}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white"
                      style={{ backgroundColor: color }}
                    >
                      {["SC", "MT", "AO", "JD"][i]}
                    </div>
                  ),
                )}
              </div>
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-900">
                  5,000+ students
                </span>{" "}
                joined this month
              </p>
            </div>
          </div>

          {/* Right Column - Dashboard Card */}
          <div className="relative flex items-center justify-center">
            {/* Glow effect */}
            <div className="pointer-events-none absolute -inset-4 rounded-[32px] bg-gradient-to-br from-blue-400/20 via-blue-200/10 to-transparent blur-2xl" />

            {/* Main Dashboard Card */}
            <div className="relative w-full max-w-[500px] rounded-[24px] border border-slate-200/60 bg-white/70 p-6 shadow-xl shadow-blue-900/5 backdrop-blur-xl md:p-8">
              {/* Top Metric Cards */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                {/* Application Score */}
                <div className="rounded-[16px] bg-gradient-to-br from-blue-600 to-blue-700 p-4 text-white">
                  <p className="text-xs font-medium text-blue-100">
                    Application Score
                  </p>
                  <p className="mt-1 text-2xl font-bold">92%</p>
                  <div className="mt-3 h-1.5 w-full rounded-full bg-white/20">
                    <div className="h-1.5 w-[92%] rounded-full bg-white" />
                  </div>
                </div>

                {/* Visa Readiness */}
                <div className="rounded-[16px] border border-slate-200 bg-white p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Visa Readiness
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">85%</p>
                  <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100">
                    <div className="h-1.5 w-[85%] rounded-full bg-blue-600" />
                  </div>
                </div>
              </div>

              {/* Statistics Section */}
              <div className="mb-6 rounded-[16px] border border-slate-100 bg-white p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    University Match
                  </span>
                  <span className="rounded-full bg-blue-50 px-3 py-0.5 text-xs font-medium text-blue-700">
                    #1 IVY Prep
                  </span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Harvard", value: 94 },
                    { label: "Stanford", value: 88 },
                    { label: "MIT", value: 82 },
                  ].map((item) => (
                    <div key={item.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">{item.label}</span>
                        <span className="font-medium text-slate-900">
                          {item.value}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100">
                        <div
                          className="h-1.5 rounded-full bg-blue-600"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visa Success App */}
              <div className="flex items-center gap-4 rounded-[16px] bg-gradient-to-r from-blue-50 to-blue-50/50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-blue-600">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Visa Success App
                  </p>
                  <p className="text-xs text-slate-500">
                    Track application status in real-time
                  </p>
                </div>
              </div>
            </div>

            {/* Floating card behind */}
            <div className="pointer-events-none absolute -right-4 -top-4 hidden h-full w-full rounded-[24px] border border-slate-200/40 bg-white/30 backdrop-blur md:block" />
          </div>
        </div>
      </div>
    </section>
  );
}