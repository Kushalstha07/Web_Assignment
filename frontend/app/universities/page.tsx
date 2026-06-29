import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import HeroBanner from "@/components/landing/HeroBanner";
import SearchBar from "@/components/landing/SearchBar";
import FilterChips from "@/components/landing/FilterChips";
import UniversityCard from "@/components/landing/UniversityCard";
import StatRow from "@/components/landing/StatRow";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Universities" };

const countries = [
  { label: "All Countries", value: "all" },
  { label: "🇺🇸 USA", value: "usa" },
  { label: "🇬🇧 UK", value: "uk" },
  { label: "🇨🇦 Canada", value: "canada" },
  { label: "🇦🇺 Australia", value: "australia" },
  { label: "🇩🇪 Germany", value: "germany" },
];

const programs = [
  { label: "All Programs", value: "all" },
  { label: "Computer Science", value: "cs" },
  { label: "Business", value: "business" },
  { label: "Engineering", value: "engineering" },
  { label: "Medicine", value: "medicine" },
  { label: "Law", value: "law" },
];

const universities = [
  {
    initials: "STF",
    gradient: "linear-gradient(135deg, #2563EB, #7C3AED)",
    name: "Stanford University",
    location: "Palo Alto, California, USA",
    program: "MS Computer Science · Fall 2025",
    tags: [
      { label: "QS Rank #3", color: "blue" },
      { label: "Scholarship Available", color: "green" },
      { label: "Deadline: Oct 15", color: "amber" },
    ],
    matchScore: 92,
    probability: 92,
  },
  {
    initials: "UOT",
    gradient: "linear-gradient(135deg, #0F172A, #1E293B)",
    name: "University of Toronto",
    location: "Toronto, Ontario, Canada",
    program: "MSc Computer Science · Fall 2025",
    tags: [
      { label: "QS Rank #21", color: "blue" },
      { label: "Research Focused", color: "purple" },
      { label: "Deadline: Dec 1", color: "amber" },
    ],
    matchScore: 88,
    probability: 85,
  },
  {
    initials: "UCL",
    gradient: "linear-gradient(135deg, #7C3AED, #6D28D9)",
    name: "University College London",
    location: "London, United Kingdom",
    program: "MSc Machine Learning · Fall 2025",
    tags: [
      { label: "QS Rank #9", color: "blue" },
      { label: "GRE Required", color: "slate" },
    ],
    matchScore: 85,
    probability: 78,
  },
  {
    initials: "MEL",
    gradient: "linear-gradient(135deg, #059669, #047857)",
    name: "University of Melbourne",
    location: "Melbourne, Victoria, Australia",
    program: "MIT · Fall 2025",
    tags: [
      { label: "QS Rank #14", color: "blue" },
      { label: "Scholarship Available", color: "green" },
      { label: "Deadline: Nov 30", color: "amber" },
    ],
    matchScore: 80,
    probability: 72,
  },
];

const stats = [
  { num: "1,200+", label: "Partner Universities" },
  { num: "40+", label: "Countries" },
  { num: "15K+", label: "Students Placed" },
  { num: "93%", label: "Acceptance Rate" },
];

export default function UniversitiesPage() {
  return (
    <>
      <Navbar />
      <section className="relative overflow-hidden bg-white">
        <HeroBanner
          breadcrumb={{ parent: "Home", current: "Universities" }}
          tag="🏛️ 1,200+ Partner Institutions"
          heading={
            <>
              Find Your <span className="text-blue-600">Perfect University</span>
            </>
          }
          subtext="Search and compare universities across 40+ countries. Get personalized match scores based on your academic profile and preferences."
        >
          <SearchBar />
          <FilterChips chips={countries} defaultActive="all" />
          <FilterChips chips={programs} defaultActive="all" />
        </HeroBanner>

        {/* Results Section */}
        <div className="bg-white py-[120px]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                  Top Matches
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-slate-500">
                  Discover your best-fit universities ranked by match score.
                </p>
              </div>
              <div className="flex gap-3">
                {["Best Match", "Deadline", "Ranking"].map((sort) => (
                  <button
                    key={sort}
                    className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-600 transition-all hover:border-blue-300 hover:text-blue-600"
                  >
                    {sort}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {universities.map((uni, i) => (
                <UniversityCard key={i} {...uni} />
              ))}
            </div>

            <div className="mt-12 text-center">
              <button className="inline-flex items-center rounded-[14px] border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50">
                Load More Universities →
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-slate-50 py-[120px]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-1 text-sm font-semibold uppercase tracking-wider text-blue-600">
              Our Impact
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Why Students Trust Us
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-500">
              Join thousands of students who have found their ideal
              universities through our platform.
            </p>
            <div className="mt-12">
              <StatRow items={stats} />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}