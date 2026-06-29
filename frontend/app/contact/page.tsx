import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import HeroBanner from "@/components/landing/HeroBanner";
import ContactForm from "@/components/landing/ContactForm";
import OfficeCard from "@/components/landing/OfficeCard";
import FaqItem from "@/components/landing/FaqItem";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact" };

const offices = [
  {
    flag: "🇺🇸",
    city: "New York (HQ)",
    address: "350 Fifth Avenue, Suite 4100\nNew York, NY 10118",
  },
  {
    flag: "🇬🇧",
    city: "London Office",
    address: "123 Oxford Street\nLondon, W1D 2LH, UK",
  },
  {
    flag: "🇸🇬",
    city: "Singapore Office",
    address: "1 Raffles Place, #20-01\nSingapore 048616",
  },
];

const faqs = [
  {
    question: "Is the initial consultation free?",
    answer:
      "Yes — your first 30-minute session is completely free, no commitment required. We'll discuss your goals, academic background, and create a personalized study abroad plan.",
  },
  {
    question: "How long does the application process take?",
    answer:
      "The timeline varies by university and program, but most applications take 4-8 weeks from start to submission. Our team helps you stay on track with clear deadlines and milestones.",
  },
  {
    question: "What countries do you cover?",
    answer:
      "We have partnerships with universities in over 40 countries, including the USA, UK, Canada, Australia, Germany, France, Singapore, and many more.",
  },
  {
    question: "Do you guarantee admission?",
    answer:
      "While we cannot guarantee admission to any specific institution, our 93% acceptance rate speaks to the effectiveness of our matching and application support services.",
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <section className="relative overflow-hidden bg-white">
        {/* Hero - Left aligned */}
        <HeroBanner
          breadcrumb={{ parent: "Home", current: "Contact" }}
          tag="📬 Get in Touch"
          heading={
            <>
              Let's Discuss Your{" "}
              <span className="text-blue-600">Study Abroad Goals</span>
            </>
          }
          subtext="Have a question about our services, partnerships, or anything else? Our team is here to help you every step of the way."
        >
          {/* Info pills */}
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-600 shadow-sm">
              📧 hello@eduglobal.com
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-600 shadow-sm">
              📞 +1 (555) 123-4567
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-600 shadow-sm">
              💬 Live Chat Available
            </div>
          </div>
        </HeroBanner>

        {/* Two Column Section: Form + Office Info */}
        <div className="bg-white py-[120px]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-2 items-start gap-16">
              {/* Left: Contact Form */}
              <div>
                <div className="mb-1 text-sm font-semibold uppercase tracking-wider text-blue-600">
                  Send a Message
                </div>
                <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                  Get in Touch
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-500">
                  Fill out the form below and we'll get back to you
                  within 24 hours.
                </p>
                <div className="mt-8">
                  <ContactForm />
                </div>
              </div>

              {/* Right: Office Cards + FAQ */}
              <div className="space-y-12">
                <div>
                  <div className="mb-1 text-sm font-semibold uppercase tracking-wider text-blue-600">
                    Our Offices
                  </div>
                  <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                    Visit Us
                  </h2>
                </div>

                <div className="space-y-4">
                  {offices.map((office, i) => (
                    <OfficeCard key={i} {...office} />
                  ))}
                </div>

                {/* Map placeholder */}
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-8 text-center shadow-sm">
                  <div className="text-4xl">🗺️</div>
                  <div className="text-lg font-semibold text-slate-900">
                    Find Us on the Map
                  </div>
                  <div className="text-sm text-slate-500">
                    Interactive map showing all our office locations
                    worldwide.
                  </div>
                </div>

                {/* FAQ */}
                <div>
                  <div className="mb-1 text-sm font-semibold uppercase tracking-wider text-blue-600">
                    FAQ
                  </div>
                  <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                    Frequently Asked Questions
                  </h2>
                  <div className="mt-8">
                    {faqs.map((faq, i) => (
                      <FaqItem key={i} {...faq} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}