import React from "react";

interface Props {
  align?: "left" | "center";
  breadcrumb?: { parent: string; current: string };
  tag: string;
  heading: React.ReactNode;
  subtext: string;
  children?: React.ReactNode;
}

export default function HeroBanner({
  align = "left",
  breadcrumb,
  tag,
  heading,
  subtext,
  children,
}: Props) {
  return (
    <div
      className={`border-b border-slate-200 bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30 px-6 pb-20 pt-16 md:pt-20 ${
        align === "center" ? "text-center" : ""
      }`}
    >
      {/* Breadcrumb */}
      {breadcrumb && (
        <div className="mx-auto mb-4 flex max-w-7xl items-center gap-1.5 text-sm text-slate-400">
          {breadcrumb.parent} ›{" "}
          <span className="font-medium text-slate-900">
            {breadcrumb.current}
          </span>
        </div>
      )}

      {/* Tag */}
      <div
        className={`mb-6 ${align === "center" ? "flex justify-center" : ""}`}
      >
        <div className="mx-auto flex max-w-7xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
            {tag}
          </span>
        </div>
      </div>

      {/* Heading */}
      <div className="mx-auto max-w-7xl">
        <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
          {heading}
        </h1>
      </div>

      {/* Subtext */}
      <div
        className={`mx-auto mt-6 ${align === "center" ? "text-center" : ""}`}
        style={{ maxWidth: 640 }}
      >
        <p className={`max-w-7xl text-lg leading-relaxed text-slate-500`}>
          {subtext}
        </p>
      </div>

      {/* Children (CTAs, search, filters, etc.) */}
      <div className="mx-auto mt-8 max-w-7xl">{children}</div>
    </div>
  );
}