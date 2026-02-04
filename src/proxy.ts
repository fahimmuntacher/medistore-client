import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { roles } from "./constant/role";

const ROLE_BASE_PATH = {
  [roles.admin]: "/dashboard/admin",
  [roles.seller]: "/dashboard/seller",
  [roles.customer]: "/dashboard/customer",
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("better-auth.session_token");

  // wihtout token can't access to the dashboard
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    // logged in user can't go to authentication pages
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // dashboard access control
    if (pathname.startsWith("/dashboard")) {
      if (pathname === "/dashboard") return NextResponse.next();

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_AUTH_URL}/get-session`,
          {
            headers: { Cookie: `better-auth.session_token=${token.value}` },
          },
        );

        if (res.ok) {
          const { user } = await res.json();
          const role = user?.role as keyof typeof ROLE_BASE_PATH;
          // console.log(role);

          const allowedBasePath = ROLE_BASE_PATH[role];

          // check the user role
          if (!pathname.startsWith(allowedBasePath)) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
          }
        }
      } catch (error) {
        console.error("Auth Middleware Error:", error);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*"],
};
