"use client";

import { useState } from "react";

interface Props {
  question: string;
  answer: string;
}

export default function FaqItem({ question, answer }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#F1F5F9] py-3.5">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-[13px] font-semibold text-[#0F172A]">
          {question}
        </span>
        <span className="text-[14px] text-[#2563EB]">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="mt-1.5 text-[12px] leading-[1.6] text-[#64748B]">
          {answer}
        </div>
      )}
    </div>
  );
}