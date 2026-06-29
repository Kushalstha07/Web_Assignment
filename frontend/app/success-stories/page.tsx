import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import HeroBanner from "@/components/landing/HeroBanner";
import StatRow from "@/components/landing/StatRow";
import FilterChips from "@/components/landing/FilterChips";
import TestimonialCard from "@/components/landing/TestimonialCard";
import CtaDark from "@/components/landing/CtaDark";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Success Stories" };

const countryFilters = [
  { label: "All Countries", value: "all" },
  { label: "🇺🇸 USA", value: "usa" },
  { label: "🇬🇧 UK", value: "uk" },
  { label: "🇨🇦 Canada", value: "canada" },
  { label: "🇦🇺 Australia", value: "australia" },
  { label: "🇩🇪 Germany", value: "germany" },
];

const featuredTestimonial = {
  variant: "blue" as const,
  initials: "MT",
  avatarColor: "rgba(255,255,255,0.2)",
  name: "Marcus Thorne",
  subtitle: "Oxford University '25 · MSc",
  university: "Oxford University",
  quote:
    "EduGlobal's matching algorithm found programs I hadn't even considered. Their visa guidance was invaluable — I felt supported every step of the way.",
};

const testimonials = [
  {
    variant: "white" as const,
    initials: "SC",
    avatarColor: "#2563EB",
    name: "Sarah Chen",
    subtitle: "University of Toronto '26 · MBA",
    university: "University of Toronto",
    quote:
      "The personalized guidance I received was exceptional. My advisor helped me craft an application that truly stood out, and I got into my dream program.",
  },
  {
    variant: "white" as const,
    initials: "AO",
    avatarColor: "#2563EB",
    name: "Amara Okafor",
    subtitle: "University of Melbourne '26 · MEng",
    university: "University of Melbourne",
    quote:
      "From scholarship applications to visa processing, EduGlobal handled everything. I couldn't have navigated the complexities without their expert team.",
  },
  {
    variant: "white" as const,
    initials: "RP",
    avatarColor: "#059669",
    name: "Ravi Patel",
    subtitle: "Stanford University '26 · MS",
    university: "Stanford University",
    quote:
      "The AI matching tool was spot-on. It identified universities that aligned perfectly with my research interests, and the acceptance probability predictions were accurate.",
  },
  {
    variant: "white" as const,
    initials: "FS",
    avatarColor: "#D97706",
    name: "Fatima Sarwar",
    subtitle: "UCL '26 · MSc",
    university: "University College London",
    quote:
      "As a first-generation applicant, I had no idea where to start. EduGlobal's counselors guided me through every step, from test prep to enrollment.",
  },
  {
    variant: "white" as const,
    initials: "KL",
    avatarColor: "#7C3AED",
    name: "Kenji Nakamura",
    subtitle: "University of Tokyo '26 · PhD",
    university: "University of Tokyo",
    quote:
      "The document preparation support was outstanding. My application package was polished and professional, which made all the difference in my acceptance.",
  },
];

const destinations = [
  { flag: "🇺🇸", country: "USA", count: "3,200+", label: "Students Placed" },
  { flag: "🇬🇧", country: "UK", count: "2,100+", label: "Students Placed" },
  { flag: "🇨🇦", country: "Canada", count: "1,800+", label: "Students Placed" },
  { flag: "🇦🇺", country: "Australia", count: "1,400+", label: "Students Placed" },
];

const heroStats = [
  { num: "15,000+", label: "Students Helped" },
  { num: "93%", label: "Success Rate" },
  { num: "500+", label: "Partner Universities" },
];

export default function SuccessStoriesPage() {
  return (
    <>
      <Navbar />
      <section className="relative overflow-hidden bg-white">
        {/* Hero - Centered */}
        <HeroBanner
          align="center"
          tag="⭐ Student Success Stories"
          heading={
            <>
              Real Stories from{" "}
              <span className="text-blue-600">Real Students</span>
            </>
          }
          subtext="Discover how EduGlobal has helped thousands of students achieve their dream of studying abroad."
        >
          <div className="mx-auto max-w-[480px]">
            <StatRow items={heroStats} />
          </div>
        </HeroBanner>

        {/* Testimonials Section */}
        <div className="bg-white py-[120px]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-1 text-sm font-semibold uppercase tracking-wider text-blue-600">
              Testimonials
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              What Our Students Say
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-500">
              Hear from students who have successfully placed in top
              universities worldwide.
            </p>

            <div className="mt-12">
              <FilterChips chips={countryFilters} defaultActive="all" />
            </div>

            {/* Featured testimonial + 2 normal */}
            <div className="mb-6 grid grid-cols-2 gap-6">
              <TestimonialCard {...featuredTestimonial} />
              {testimonials.slice(0, 2).map((t, i) => (
                <TestimonialCard key={i} {...t} />
              ))}
            </div>

            {/* 3 normal testimonials */}
            <div className="grid grid-cols-3 gap-6">
              {testimonials.slice(2, 5).map((t, i) => (
                <TestimonialCard key={i} {...t} />
              ))}
            </div>
          </div>
        </div>

        {/* Destinations Section */}
        <div className="bg-slate-50 py-[120px]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-1 text-sm font-semibold uppercase tracking-wider text-blue-600">
              Destinations
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Top Study Destinations
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-500">
              Our students have been accepted into leading universities
              across the globe.
            </p>

            <div className="mt-12 grid grid-cols-4 gap-6">
              {destinations.map((dest, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-blue-100 bg-blue-50 p-6 shadow-sm"
                >
                  <div className="mb-3 text-3xl">{dest.flag}</div>
                  <div className="text-xl font-bold text-slate-900">
                    {dest.country}
                  </div>
                  <div className="mt-2 text-4xl font-bold text-blue-600">
                    {dest.count}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    {dest.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white py-[120px]">
          <div className="mx-auto max-w-7xl px-6">
            <CtaDark
              heading="Start Your Success Story"
              subtext="Join thousands of students who have found their perfect university match with EduGlobal."
              primaryLabel="Get Started Free"
              secondaryLabel="Talk to an Advisor"
            />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}