interface Props {
  placeholder?: string;
}

export default function SearchBar({
  placeholder = "Search by university name, country, or program…",
}: Props) {
  return (
    <div className="mb-6 flex max-w-xl items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <span className="text-lg">🔍</span>
      <span className="text-sm text-slate-400">{placeholder}</span>
    </div>
  );
}