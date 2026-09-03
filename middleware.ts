// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Mirrors lib/auth/session.ts's cookie name — kept as a literal here rather
// than importing it, since middleware runs on the Edge runtime and
// lib/auth/session.ts pulls in next/headers, which isn't Edge-safe.
const SESSION_COOKIE_NAME = "etihad_session";

const PROTECTED_PREFIXES = ["/orders", "/account"];
const AUTH_PAGES = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (isProtected && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));
  if (isAuthPage && hasSession) {
    return NextResponse.redirect(new URL("/events", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/orders/:path*", "/account/:path*", "/login", "/register"],
};