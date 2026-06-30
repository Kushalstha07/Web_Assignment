"use client";

import { useState } from "react";

interface Chip {
  label: string;
  value: string;
}

interface Props {
  chips: Chip[];
  defaultActive?: string;
}

export default function FilterChips({ chips, defaultActive }: Props) {
  const [active, setActive] = useState(defaultActive || chips[0]?.value);

  return (
    <div className="mb-6 flex flex-wrap gap-3">
      {chips.map((chip) => (
        <button
          key={chip.value}
          onClick={() => setActive(chip.value)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
            active === chip.value
              ? "bg-blue-600 text-white shadow-sm"
              : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"
          }`}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}