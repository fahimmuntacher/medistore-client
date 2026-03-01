import { createAuthClient } from "better-auth/react";

// export const authClient = createAuthClient({
//   // baseURL: "http://localhost:5000",
//   baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
//   fetchOptions: {
//     credentials: "include",
//   },
// });

// export const authClient = createAuthClient({
//   baseURL: typeof window !== "undefined" ? window.location.origin : "",
//   basePath: "/api/auth",
//   fetchOptions: {
//     credentials: "include",
//   },
// });

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
  fetchOptions: {
    credentials: "include",
  },
});
