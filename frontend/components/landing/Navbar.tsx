import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" stroke="#2563EB" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="4" fill="#2563EB" />
            <path
              d="M2 12H22"
              stroke="#2563EB"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M12 2C15 5 16.5 8.5 16.5 12C16.5 15.5 15 19 12 22"
              stroke="#2563EB"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M12 2C9 5 7.5 8.5 7.5 12C7.5 15.5 9 19 12 22"
              stroke="#2563EB"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-xl font-bold text-slate-900">EduGlobal</span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-slate-700 transition-colors hover:text-blue-600"
          >
            Home
          </Link>
          <Link
            href="/universities"
            className="text-sm font-medium text-slate-700 transition-colors hover:text-blue-600"
          >
            Universities
          </Link>
          <Link
            href="/services"
            className="text-sm font-medium text-slate-700 transition-colors hover:text-blue-600"
          >
            Services
          </Link>
          <Link
            href="/success-stories"
            className="text-sm font-medium text-slate-700 transition-colors hover:text-blue-600"
          >
            Success Stories
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-slate-700 transition-colors hover:text-blue-600"
          >
            Contact
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-700 transition-colors hover:text-blue-600"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-[14px] bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}