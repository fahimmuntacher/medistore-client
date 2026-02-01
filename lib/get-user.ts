
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getCurrentUser = cache(async () => {
  try {
    const cookieStore = await cookies();
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_AUTH_URL}/get-session`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const session = await res.json();
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
    const res = await fetch("http://localhost:5000/api/auth/get-session", {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

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