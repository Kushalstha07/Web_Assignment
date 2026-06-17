export default function SuccessStories() {
  const testimonials = [
    {
      quote:
        "EduGlobal made my dream of studying abroad a reality. Their matching algorithm found universities I never considered that perfectly fit my profile.",
      name: "Sarah Chen",
      university: "University of Toronto '26",
      color: "#2563EB",
      initials: "SC",
    },
    {
      quote:
        "The personalized guidance I received was incredible. From application to visa, every step was seamless. I couldn't have done it without EduGlobal.",
      name: "Marcus Thorne",
      university: "Oxford University '25",
      color: "#0F172A",
      initials: "MT",
    },
    {
      quote:
        "What sets EduGlobal apart is their combination of AI technology and human expertise. The perfect balance for navigating complex applications.",
      name: "Amara Okafor",
      university: "Stanford Graduate School",
      color: "#2563EB",
      initials: "AO",
    },
  ];

  return (
    <section className="bg-slate-50 py-[120px]">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-16 flex items-end justify-between">
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Stories of Ambition Realized
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-500">
              Join thousands of students who have navigated their complex
              application journeys with confidence.
            </p>
          </div>
          {/* Carousel arrows */}
          <div className="hidden items-center gap-3 md:flex">
            <button className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 12L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 4L10 8L6 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Stars */}
              <div className="mb-5 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 1.5L11.2455 6.51573L17 7.1459L12.755 11.2098L13.9098 17.1459L9 14.1545L4.09017 17.1459L5.245 11.2098L1 7.1459L6.7545 6.51573L9 1.5Z"
                      fill="#E2A526"
                      stroke="#E2A526"
                      strokeWidth="0.5"
                    />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="leading-relaxed text-slate-600">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Avatar + Info */}
              <div className="mt-8 flex items-center gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: testimonial.color }}
                >
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {testimonial.university}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}