interface Props {
  icon: string;
  title: string;
  description: string;
  tags: { label: string; color: string }[];
  statusDot: string;
  statusLabel: string;
}

const tagColors: Record<string, string> = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  purple: "bg-purple-50 text-purple-700",
  slate: "bg-slate-100 text-slate-600",
};

export default function ServiceCard({
  icon,
  title,
  description,
  tags,
  statusDot,
  statusLabel,
}: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
        {icon}
      </div>
      <div className="text-xl font-bold text-slate-900">{title}</div>
      <div className="text-base leading-relaxed text-slate-500">
        {description}
      </div>
      <div className="flex flex-wrap gap-2">
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
      <div className="flex items-center gap-2">
        <div
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: statusDot }}
        />
        <span className="text-sm text-slate-500">{statusLabel}</span>
      </div>
    </div>
  );
}