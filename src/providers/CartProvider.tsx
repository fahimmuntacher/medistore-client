"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useCartStore } from "../app/store/CartStore";


export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading } = useAuth();
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    if (!loading && isLoggedIn) {
      fetchCart();
    }
  }, [isLoggedIn, loading, fetchCart]);

  return <>{children}</>;
}