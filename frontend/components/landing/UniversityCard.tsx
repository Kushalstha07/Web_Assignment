interface Props {
  initials: string;
  gradient: string;
  name: string;
  location: string;
  program: string;
  tags: { label: string; color: string }[];
  matchScore: number;
  probability: number;
}

const tagColors: Record<string, string> = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  purple: "bg-purple-50 text-purple-700",
  slate: "bg-slate-100 text-slate-600",
};

export default function UniversityCard({
  initials,
  gradient,
  name,
  location,
  program,
  tags,
  matchScore,
  probability,
}: Props) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      {/* Avatar */}
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
        style={{ background: gradient }}
      >
        {initials}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="text-lg font-semibold text-slate-900">{name}</div>
        <div className="mt-0.5 text-sm text-slate-500">📍 {location}</div>
        <div className="mt-1 text-sm text-slate-500">{program}</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
                tagColors[tag.color] || tagColors.blue
              }`}
            >
              {tag.label}
            </span>
          ))}
        </div>
        {/* Progress bar */}
        <div className="mt-4 max-w-[200px]">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600"
              style={{ width: `${probability}%` }}
            />
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Acceptance probability: {probability}%
          </div>
        </div>
      </div>

      {/* Match score */}
      <div className="ml-auto shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-600">
        {matchScore}% Match
      </div>
    </div>
  );
}