interface Props {
  variant?: "white" | "blue";
  initials: string;
  avatarColor: string;
  name: string;
  subtitle: string;
  university: string;
  quote: string;
  className?: string;
}

export default function TestimonialCard({
  variant = "white",
  initials,
  avatarColor,
  name,
  subtitle,
  university,
  quote,
  className = "",
}: Props) {
  const isBlue = variant === "blue";

  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${
        isBlue
          ? "border-blue-600"
          : "border-slate-200 bg-white"
      } ${className}`}
      style={
        isBlue
          ? { background: "linear-gradient(135deg,#2563EB,#1D4ED8)" }
          : undefined
      }
    >
      {/* Stars */}
      <div className="mb-3 text-base tracking-wider text-amber-400">★★★★★</div>

      {/* University tag */}
      <div className="mb-3">
        {isBlue ? (
          <span className="inline-block rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold text-blue-200">
            {university}
          </span>
        ) : (
          <span className="inline-block rounded-full bg-blue-50 px-3 py-0.5 text-xs font-semibold text-blue-700">
            {university}
          </span>
        )}
      </div>

      {/* Quote */}
      <p
        className={`mb-4 text-sm leading-relaxed italic ${
          isBlue ? "text-blue-200" : "text-slate-600"
        }`}
      >
        &ldquo;{quote}&rdquo;
      </p>

      {/* Person row */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ background: avatarColor }}
        >
          {initials}
        </div>
        <div>
          <div
            className={`text-sm font-semibold ${
              isBlue ? "text-white" : "text-slate-900"
            }`}
          >
            {name}
          </div>
          <div
            className={`text-xs ${
              isBlue ? "text-blue-200" : "text-slate-500"
            }`}
          >
            {subtitle}
          </div>
        </div>
      </div>
    </div>
  );
}