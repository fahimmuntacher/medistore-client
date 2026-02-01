"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_AUTH_URL}/get-session`,
          {
            withCredentials: true,
          },
        );
        setUser(res.data?.user ?? null);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, isLoggedIn: !!user, loading };
}
