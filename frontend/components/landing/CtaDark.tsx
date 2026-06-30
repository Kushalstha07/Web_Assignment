interface Props {
  heading: string;
  subtext: string;
  primaryLabel: string;
  secondaryLabel?: string;
}

export default function CtaDark({
  heading,
  subtext,
  primaryLabel,
  secondaryLabel,
}: Props) {
  return (
    <div className="rounded-[20px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-20 text-center md:px-16">
      <div className="text-3xl font-bold text-white md:text-5xl">{heading}</div>
      <div className="mx-auto mt-4 max-w-lg text-lg text-slate-300">
        {subtext}
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button className="inline-flex items-center rounded-[14px] bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md">
          {primaryLabel}
        </button>
        {secondaryLabel && (
          <button className="inline-flex items-center rounded-[14px] border border-slate-600 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-slate-500 hover:bg-white/20">
            {secondaryLabel}
          </button>
        )}
      </div>
    </div>
  );
}