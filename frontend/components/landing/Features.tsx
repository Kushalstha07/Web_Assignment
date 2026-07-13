export default function Features() {
  const features = [
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M12 3V6M12 18V21M3 12H6M18 12H21"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
      title: "Smart University Matching",
      description:
        "Our proprietary algorithm analyzes your grades, extracurriculars, and personal goals to find institutions where you'll thrive.",
      variant: "white" as const,
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 3C16.9706 3 21 7.02944 21 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M12 3C7.02944 3 3 7.02944 3 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M12 21C7.02944 21 3 16.9706 3 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M12 21C16.9706 21 21 16.9706 21 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      ),
      title: "AI Recommendation",
      description:
        "Receive machine-curated insights, course selection, and career pathways tailored to your unique profile.",
      variant: "blue" as const,
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 2V8H20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 13H8M16 17H8M10 9H8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Document Hub",
      description:
        "Securely store and manage transcripts, letters of recommendation, and personal statements.",
      variant: "white" as const,
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Expert Human Counselors",
      description:
        "Connect with certified advisors who have helped thousands of students reach their dream universities.",
      variant: "light" as const,
      cta: "Talk to a Pro",
    },
  ];

  return (
    <section className="bg-white py-[120px]">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Precision Tools for
            <br />
            Global Success
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-500">
            We&apos;ve built a suite of AI-powered tools designed to take the
            guesswork out of your university search and application process.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-[24px] border p-8 transition-all hover:-translate-y-1 hover:shadow-lg ${
                feature.variant === "blue"
                  ? "border-blue-600 bg-gradient-to-br from-blue-600 to-blue-700 text-white"
                  : feature.variant === "light"
                    ? "border-blue-100 bg-blue-50 text-slate-900"
                    : "border-slate-200 bg-white text-slate-900"
              }`}
            >
              {/* Icon */}
              <div
                className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-[14px] ${
                  feature.variant === "blue"
                    ? "bg-white/20 text-white"
                    : feature.variant === "light"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-slate-100 text-slate-700"
                }`}
              >
                {feature.icon}
              </div>

              {/* Title */}
              <h3
                className={`text-xl font-semibold ${
                  feature.variant === "blue" ? "text-white" : "text-slate-900"
                }`}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p
                className={`mt-3 leading-relaxed ${
                  feature.variant === "blue"
                    ? "text-blue-100"
                    : "text-slate-500"
                }`}
              >
                {feature.description}
              </p>

              {/* CTA (if applicable) */}
              {feature.cta && (
                <button className="mt-6 inline-flex items-center gap-2 rounded-[14px] bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition-all hover:shadow-md">
                  {feature.cta}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
