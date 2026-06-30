import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1D4ED8]/90 to-[#1D4ED8] px-4 py-12">
      {/* Noise overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[4%]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Organic floating blobs */}
      <svg
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-30"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <ellipse
          cx="200"
          cy="150"
          rx="400"
          ry="300"
          fill="#F59E0B"
          opacity="0.12"
          className="animate-[blob_20s_ease-in-out_infinite]"
        />
        <ellipse
          cx="1200"
          cy="700"
          rx="350"
          ry="250"
          fill="#60A5FA"
          opacity="0.08"
          className="animate-[blob_25s_ease-in-out_infinite_reverse]"
        />
        <ellipse
          cx="800"
          cy="450"
          rx="500"
          ry="200"
          fill="#F59E0B"
          opacity="0.06"
          className="animate-[blob_18s_ease-in-out_infinite]"
          style={{ animationDelay: "-5s" }}
        />
        <ellipse
          cx="100"
          cy="800"
          rx="300"
          ry="200"
          fill="#93C5FD"
          opacity="0.08"
          className="animate-[blob_22s_ease-in-out_infinite_reverse]"
          style={{ animationDelay: "-10s" }}
        />
      </svg>

      {/* Center Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-[420px]">
        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/80 px-8 pb-8 pt-10 shadow-2xl shadow-black/10 backdrop-blur-2xl md:px-10">
          {/* Logo inside card */}
          <div className="mb-8 flex items-center gap-2.5">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" stroke="#1D4ED8" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="4" fill="#1D4ED8" />
              <path
                d="M2 12H22"
                stroke="#1D4ED8"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M12 2C15 5 16.5 8.5 16.5 12C16.5 15.5 15 19 12 22"
                stroke="#1D4ED8"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M12 2C9 5 7.5 8.5 7.5 12C7.5 15.5 9 19 12 22"
                stroke="#1D4ED8"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-xl font-bold text-[#1D4ED8]">EduGlobal</span>
          </div>

          {children}
        </div>

        {/* Inline testimonial — below card */}
        <div className="mt-8 flex items-center justify-center gap-3 text-center">
          <div className="flex -space-x-2">
            {["#1D4ED8", "#F59E0B", "#64748B"].map((color, i) => (
              <div
                key={i}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/80 text-[10px] font-bold text-white"
                style={{ backgroundColor: color }}
              >
                {["SC", "RM", "AO"][i]}
              </div>
            ))}
          </div>
          <p className="text-sm text-white/80">
            <span className="font-semibold text-white">15,000+ students</span>{" "}
            found their university match
          </p>
        </div>
      </div>

      {/* Bottom Trust Strip */}
      <div className="relative z-10 mt-12 flex flex-col items-center gap-4 text-center sm:flex-row sm:gap-8">
        <div className="flex items-center gap-2">
          <span className="text-sm text-yellow-400">⭐</span>
          <span className="text-sm font-medium text-white/90">4.8/5</span>
          <span className="text-sm text-white/50">Student Satisfaction</span>
        </div>
        <div className="hidden h-4 w-px bg-white/20 sm:block" />
        <div className="flex items-center gap-4">
          {["Toronto", "Melbourne", "Manchester"].map((name) => (
            <span key={name} className="text-sm font-semibold text-white/60">
              {name}
            </span>
          ))}
        </div>
        <div className="hidden h-4 w-px bg-white/20 sm:block" />
        <Link
          href="/contact"
          className="flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white/80"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.921 9.29152 14.92 10C14.92 12 11.92 13 11.92 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 17H12.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          Help
        </Link>
      </div>
    </main>
  );
}