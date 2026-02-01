import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ middleware-safe cookie access
  const token = request.cookies.get("better-auth.session_token");
    // console.log(token);
  // 🔒 Logged IN user
  if (token) {
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 🔓 Logged OUT user
  if (!token) {
    if (pathname.startsWith("/home")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/home/:path*"],
};
