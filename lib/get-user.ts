
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getCurrentUser = cache(async () => {
  try {
    const cookieStore = await cookies();
    // console.log(cookieStore);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_AUTH_URL}/get-session`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    // console.log("res", res);
    const session = await res.json();
    // console.log(session);
    return session?.user ?? null;
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
});

// Optional: Get full session
export const getSession = cache(async () => {
  try {
    const cookieStore = await cookies();
    if(!cookieStore){
      return null
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-session`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    // console.log("get user res", res);
    return await res.json();
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
});

// Optional: Require authentication (auto redirect)
export const requireUser = cache(async () => {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }
  
  return user;
});