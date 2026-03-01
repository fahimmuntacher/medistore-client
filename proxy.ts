import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { roles } from "./src/constant/role";

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

// import { NextRequest, NextResponse } from "next/server";

// const ROLE_BASE_PATH = {
//   admin: "/dashboard/admin",
//   seller: "/dashboard/seller",
//   customer: "/dashboard/customer",
// };

// export async function proxy(request: NextRequest) {
//   const pathname = request.nextUrl.pathname;
//   console.log("proxy pathname", pathname);
//   const token = request.cookies.get("better-auth.session_token");
//   console.log("proxy token",token);
//   // skip auth pages if no token
//   if (!token) {
//     if (pathname.startsWith("/dashboard")) {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//     return NextResponse.next();
//   }

//   // optionally prevent logged-in users from accessing auth pages
//   if (pathname === "/login" || pathname === "/register") {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   // Optional: redirect /dashboard root to role-specific dashboard
//   // (avoid calling API in middleware)
//   if (pathname === "/dashboard") {
//     // you can decode role from token here if it's JWT
//     // or handle this logic inside the dashboard page itself
//     return NextResponse.next();
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/login", "/register"],
// };
