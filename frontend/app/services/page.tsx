import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import HeroBanner from "@/components/landing/HeroBanner";
import ServiceCard from "@/components/landing/ServiceCard";
import StepListItem from "@/components/landing/StepListItem";
import CtaDark from "@/components/landing/CtaDark";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Services" };

const services = [
  {
    icon: "🎯",
    title: "AI University Matching",
    description:
      "Our advanced AI analyzes your academic profile, preferences, and goals to find the perfect university matches across 40+ countries.",
    tags: [
      { label: "Included Free", color: "green" },
      { label: "Instant Results", color: "blue" },
    ],
    statusDot: "#22C55E",
    statusLabel: "Available for all plans",
  },
  {
    icon: "📋",
    title: "Application Management",
    description:
      "End-to-end application support including document preparation, essay review, and submission tracking for multiple universities.",
    tags: [
      { label: "Premium Feature", color: "amber" },
      { label: "Dedicated Advisor", color: "purple" },
    ],
    statusDot: "#8B5CF6",
    statusLabel: "Premium plan required",
  },
  {
    icon: "🛂",
    title: "Visa Assistance",
    description:
      "Expert guidance through the entire visa application process with document verification, interview prep, and timeline management.",
    tags: [
      { label: "End-to-End Support", color: "green" },
      { label: "95% Success Rate", color: "blue" },
    ],
    statusDot: "#F59E0B",
    statusLabel: "Available for all plans",
  },
  {
    icon: "💰",
    title: "Scholarship Guidance",
    description:
      "Identify and apply for scholarships that match your profile. Our team helps you maximize your chances of securing funding.",
    tags: [
      { label: "Free Assessment", color: "green" },
      { label: "$2M+ Awarded", color: "blue" },
    ],
    statusDot: "#22C55E",
    statusLabel: "Free consultation available",
  },
];

const steps = [
  {
    step: "01",
    title: "Create Your Profile",
    description:
      "Fill in your academic background, test scores, preferences, and career goals to help us understand your unique profile.",
  },
  {
    step: "02",
    title: "Get AI-Matched Recommendations",
    description:
      "Receive personalized university recommendations with match scores, acceptance probabilities, and detailed comparisons.",
  },
  {
    step: "03",
    title: "Apply with Expert Support",
    description:
      "Work with dedicated advisors to prepare applications, write essays, and track deadlines across multiple universities.",
  },
  {
    step: "04",
    title: "Secure Your Visa & Enroll",
    description:
      "Get visa assistance, pre-departure guidance, and ongoing support to ensure a smooth transition to your new university.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <section className="relative overflow-hidden bg-white">
        {/* Hero - Centered */}
        <HeroBanner
          align="center"
          tag="✨ Comprehensive Support"
          heading={
            <>
              Everything You Need for{" "}
              <span className="text-blue-600">Study Abroad</span>
            </>
          }
          subtext="From university matching to visa guidance, we provide end-to-end support for your international education journey."
        >
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/register"
              className="inline-flex items-center gap-2 rounded-[14px] bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
            >
              Get Started Free
            </a>
            <button className="inline-flex items-center rounded-[14px] border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50">
              View All Services
            </button>
          </div>
        </HeroBanner>

        {/* Core Services */}
        <div className="bg-white py-[120px]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-1 text-sm font-semibold uppercase tracking-wider text-blue-600">
              Core Services
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              What We Offer
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-500">
              Comprehensive services designed to support every step of your
              study abroad journey.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-6">
              {services.map((service, i) => (
                <ServiceCard key={i} {...service} />
              ))}
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-slate-50 py-[120px]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-1 text-sm font-semibold uppercase tracking-wider text-blue-600">
              How It Works
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Your Journey with EduGlobal
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-500">
              A simple four-step process to get you from application to
              enrollment at your dream university.
            </p>

            <div className="mt-12 flex flex-col gap-6">
              {steps.map((step, i) => (
                <StepListItem key={i} {...step} />
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white py-[120px]">
          <div className="mx-auto max-w-7xl px-6">
            <CtaDark
              heading="Ready to get started?"
              subtext="Book a free 30-minute consultation with one of our expert counselors."
              primaryLabel="Book Free Consultation"
              secondaryLabel="View Pricing"
            />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}