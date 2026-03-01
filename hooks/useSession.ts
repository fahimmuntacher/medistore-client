import { authClient } from "@/lib/auth-client";
import { useMemo } from "react";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  role?: "ADMIN" | "SELLER" | "CUSTOMER"; 
}

export const useUser = () => {
  const { data: session, isPending, error, refetch } = authClient.useSession();

  
  const user = useMemo(() => session?.user as SessionUser ?? null, [session]);
    // console.log(user);
  return {
    user,
    session,
    isLoading: isPending,
    isAuthenticated: !!session,
    error,
    refreshUser: refetch,
  };
};
