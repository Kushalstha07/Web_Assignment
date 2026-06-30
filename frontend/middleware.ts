import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = [
  "/dashboard",
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

// Admin-only paths - only accessible to admin users
const adminPaths = [
  "/students",
  "/pipeline",
  "/analytics",
  "/reports",
  "/counsellors",
  "/verification",
  "/visa",
];

const authPaths = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value || request.cookies.get("client-token")?.value;

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

  // For admin-only routes, we can't check role at middleware level since we don't have the user object
  // The AdminGuard component will handle client-side role checking
  // In production, you'd want to decode the JWT here to check role

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|uploads|$).*)",
  ],
};