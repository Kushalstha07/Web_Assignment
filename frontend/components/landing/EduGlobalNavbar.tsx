"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  activePage: string;
}

export default function EduGlobalNavbar({ activePage }: Props) {
  const pathname = usePathname();

  const links = [
    { label: "Home", href: "/" },
    { label: "Universities", href: "/universities" },
    { label: "Services", href: "/services" },
    { label: "Success Stories", href: "/success-stories" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className="flex h-14 items-center justify-between rounded-t-[10px] border-b border-[#E2E8F0] bg-white/92 px-6">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-[7px]">
        <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#2563EB]">
          <div className="h-2 w-2 rounded-full bg-[#2563EB]" />
        </div>
        <span className="text-[15px] font-bold text-[#0F172A]">EduGlobal</span>
      </Link>

      {/* Nav links */}
      <div className="flex gap-5">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-xs font-medium ${
              link.href === "/" + activePage || pathname === link.href
                ? "text-[#2563EB]"
                : "text-[#64748B]"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/register"
        className="rounded-[10px] bg-[#2563EB] px-4 py-[7px] text-xs font-semibold text-white"
      >
        Get Started
      </Link>
    </nav>
  );
}