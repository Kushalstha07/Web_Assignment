interface StatItem {
  num: string;
  label: string;
}

interface Props {
  items: StatItem[];
  className?: string;
}

export default function StatRow({ items, className = "" }: Props) {
  return (
    <div className={`flex gap-6 ${className}`}>
      {items.map((item, i) => (
        <div
          key={i}
          className="flex-1 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
        >
          <div className="text-4xl font-bold text-blue-600">{item.num}</div>
          <div className="mt-1 text-sm text-slate-500">{item.label}</div>
        </div>
      ))}
    </div>
  );
}