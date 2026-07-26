import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = [
  "/dashboard",
  "/admin",
  "/ai-chat",
  "/onboarding",
  "/students",
  "/applications",
  "/universities",
  "/scholarships",
  "/recommendations",
  "/verification",
  "/visa",
  "/counsellors",
  "/appointments",
  "/messages",
  "/reports",
  "/analytics",
  "/settings",
  "/profile",
  "/change-password",
  "/pipeline",
];

const authPaths = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Redirect authenticated users away from auth pages
  if (token && authPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users to login for protected routes
  if (!token && protectedPaths.some((path) => pathname.startsWith(path))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|uploads|$).*)",
  ],
};
