"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin, RefreshCw, Sparkles, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { ApiError } from "@/lib/api/client";
import { getUniversityRecommendations, type UniversityRecommendation } from "@/lib/api/university.api";

export default function RecommendationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [matches, setMatches] = useState<UniversityRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profileMissing, setProfileMissing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { if (!authLoading && !user) router.push("/login"); }, [authLoading, user, router]);

  const loadRecommendations = useCallback(async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true); else setLoading(true);
      const response = await getUniversityRecommendations(9);
      setMatches(response.data || []);
      setProfileMissing(false);
      setError("");
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 404) {
        setProfileMissing(true);
        setMatches([]);
        setError("");
      } else {
        setError(cause instanceof Error ? cause.message : "Unable to create recommendations");
      }
    } finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => {
    if (!user || user.role !== "student") return;
    const timer = window.setTimeout(() => void loadRecommendations(), 0);
    return () => window.clearTimeout(timer);
  }, [user, loadRecommendations]);

  if (authLoading || loading) return <div className="grid gap-6 md:grid-cols-3">{[1,2,3].map((item) => <SkeletonCard key={item}/>)}</div>;
  if (!user) return null;

  return <RoleGuard roles={["student"]}><div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">University Recommendations</h1><p className="mt-1 text-sm text-[#64748B]">Ranked securely from your destinations, budget, study field, qualification, and GPA.</p></div>
      <Button variant="secondary" loading={refreshing} onClick={() => void loadRecommendations(true)}><RefreshCw className="h-4 w-4"/>Refresh matches</Button>
    </div>

    {profileMissing && <Card className="border-[#F59E0B]/40 bg-[#FFF9EE]"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="font-semibold text-[#92400E]">Complete your academic profile first</p><p className="mt-1 text-sm text-[#A16207]">Your preferences and academic history are needed to create meaningful matches.</p></div><Link href="/onboarding/step-1" className="rounded-xl bg-[#F59E0B] px-4 py-2 text-sm font-semibold text-white">Complete profile</Link></div></Card>}
    {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

    {matches.length > 0 && <Card className="border-0 bg-gradient-to-r from-[#7C3AED] to-[#2563EB] text-white"><div className="flex items-center gap-3"><Sparkles className="h-6 w-6"/><div><p className="font-semibold">Your strongest match is {matches[0].name}</p><p className="text-sm text-blue-100">The score is a profile fit guide, not an admission guarantee.</p></div></div></Card>}

    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{matches.map((item) => <Card key={item.id} className="flex flex-col">
      <div className="flex items-start justify-between gap-3"><div><h2 className="font-bold text-[#0F172A]">{item.name}</h2><p className="mt-1 flex items-center gap-1 text-xs text-[#64748B]"><MapPin className="h-3.5 w-3.5"/>{item.city}, {item.country.toUpperCase()}</p></div><div className="shrink-0 rounded-full bg-[#F0FDF4] px-3 py-1 text-sm font-bold text-[#16A34A]">{item.score}%</div></div>
      <div className="mt-4 flex items-center justify-between text-sm"><span className="flex items-center gap-1"><Star className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]"/>{item.rating || "New"}</span><span className="text-[#64748B]">Rank {item.worldRanking || item.ranking}</span></div>
      <p className="mt-3 text-sm text-[#64748B]">${item.tuitionFee.toLocaleString()} tuition · {item.courseType}</p>
      <div className="mt-4 flex flex-wrap gap-2">{item.reasons.map((reason) => <Badge key={reason} variant="info">{reason}</Badge>)}</div>
      <Link href={`/universities/${item.id}`} className="mt-auto flex items-center justify-end gap-1 border-t pt-4 text-sm font-semibold text-[#2563EB]">View university <ArrowRight className="h-4 w-4"/></Link>
    </Card>)}</div>
    {!profileMissing && !error && !matches.length && <Card><p className="text-center text-sm text-[#64748B]">No active universities are available for matching yet.</p></Card>}
  </div></RoleGuard>;
}
