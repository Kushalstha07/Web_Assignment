interface Props {
  flag: string;
  city: string;
  address: string;
}

export default function OfficeCard({ flag, city, address }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="text-2xl">{flag}</div>
        <div>
          <div className="text-base font-semibold text-slate-900">{city}</div>
          <div className="mt-1 text-sm leading-relaxed text-slate-500">
            {address.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}