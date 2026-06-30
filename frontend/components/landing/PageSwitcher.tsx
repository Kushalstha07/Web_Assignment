"use client";

import { useState } from "react";

interface Page {
  id: string;
  label: string;
}

interface Props {
  pages: Page[];
  defaultActive?: string;
  onSwitch?: (id: string) => void;
}

export default function PageSwitcher({
  pages,
  defaultActive,
  onSwitch,
}: Props) {
  const [active, setActive] = useState(defaultActive || pages[0]?.id);

  const handleClick = (id: string) => {
    setActive(id);
    onSwitch?.(id);
  };

  return (
    <div className="flex flex-wrap gap-2 pb-6 pt-4">
      {pages.map((page) => (
        <button
          key={page.id}
          onClick={() => handleClick(page.id)}
          className={`rounded-full px-[18px] py-2 text-[13px] font-medium transition-all ${
            active === page.id
              ? "border-[#2563EB] bg-[#2563EB] text-white"
              : "border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB]"
          } border`}
        >
          {page.label}
        </button>
      ))}
    </div>
  );
}