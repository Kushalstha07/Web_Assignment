"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin, Sparkles, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { getMyProfile } from "@/lib/api/academic-profile.api";
import { getUniversities, type University } from "@/lib/api/university.api";
import type { AcademicProfile } from "@/lib/schemas/academic-profile.schema";

type Match = University & { score: number; reasons: string[] };

function scoreUniversity(university: University, profile: AcademicProfile | null): Match {
  let score = 45;
  const reasons: string[] = [];
  if (profile?.preferredCountries?.includes(university.country)) { score += 25; reasons.push("Preferred destination"); }
  if (profile?.tuitionBudget && profile.tuitionBudget === university.budgetRange) { score += 20; reasons.push("Matches your budget"); }
  if (profile?.fieldOfStudy && university.programs.some((program) => program.toLowerCase().includes(profile.fieldOfStudy.toLowerCase()) || profile.fieldOfStudy.toLowerCase().includes(program.toLowerCase()))) { score += 15; reasons.push("Offers your study field"); }
  if ((profile?.gpa || 0) >= 3.5 && ["top-10", "top-50"].includes(university.ranking)) { score += 5; reasons.push("Strong academic fit"); }
  if (!reasons.length) reasons.push("Broad profile match");
  return { ...university, score: Math.min(100, score), reasons };
}

export default function RecommendationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<AcademicProfile | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { if (!authLoading && !user) router.push("/login"); }, [authLoading, user, router]);
  useEffect(() => {
    if (!user) return;
    void Promise.all([getMyProfile(), getUniversities({ limit: 100 })]).then(([profileResult, universityResult]) => {
      if (profileResult.success) setProfile(profileResult.data);
      setUniversities(universityResult.data || []);
    }).catch((cause) => setError(cause instanceof Error ? cause.message : "Unable to create recommendations")).finally(() => setLoading(false));
  }, [user]);

  const matches = useMemo(() => universities.map((university) => scoreUniversity(university, profile)).sort((a, b) => b.score - a.score).slice(0, 9), [universities, profile]);
  if (authLoading || loading) return <div className="grid gap-6 md:grid-cols-3">{[1,2,3].map((item) => <SkeletonCard key={item}/>)}</div>;
  if (!user) return null;

  return <div className="space-y-6">
    <div className="flex items-start justify-between gap-4"><div><h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">University Recommendations</h1><p className="mt-1 text-sm text-[#64748B]">Personalised using your profile, destinations, budget, GPA, and field of study.</p></div><div className="shrink-0 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#2563EB] p-3 text-white shadow-lg shadow-purple-500/20"><Sparkles className="h-6 w-6"/></div></div>
    {!profile && <Card className="border-[#F59E0B]/40 bg-[#FFF9EE]"><p className="text-sm text-[#92400E]">Complete your academic profile to improve these matches. <Link href="/onboarding/step-1" className="font-semibold underline">Complete profile</Link></p></Card>}
    {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{matches.map((item) => <Card key={item.id} className="flex flex-col">
      <div className="flex items-start justify-between"><div><h2 className="font-bold text-[#0F172A]">{item.name}</h2><p className="mt-1 flex items-center gap-1 text-xs text-[#64748B]"><MapPin className="h-3.5 w-3.5"/>{item.city}, {item.country.toUpperCase()}</p></div><div className="rounded-full bg-[#F0FDF4] px-3 py-1 text-sm font-bold text-[#16A34A]">{item.score}%</div></div>
      <div className="mt-4 flex items-center justify-between text-sm"><span className="flex items-center gap-1"><Star className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]"/>{item.rating || "New"}</span><span className="text-[#64748B]">Rank {item.worldRanking || item.ranking}</span></div><p className="mt-3 text-sm text-[#64748B]">${item.tuitionFee.toLocaleString()} tuition · {item.courseType}</p><div className="mt-4 flex flex-wrap gap-2">{item.reasons.map((reason) => <Badge key={reason} variant="info">{reason}</Badge>)}</div>
      <Link href={`/universities/${item.id}`} className="mt-5 flex items-center justify-end gap-1 border-t pt-4 text-sm font-semibold text-[#2563EB]">View university <ArrowRight className="h-4 w-4"/></Link>
    </Card>)}</div>
    {!matches.length && <Card><p className="text-center text-sm text-[#64748B]">No universities are available yet. Run the backend seed to add the catalogue.</p></Card>}
  </div>;
}
