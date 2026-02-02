"use client";

import { useCart } from "../providers/CartProvider";
import { CartEmpty } from "./CartEmpty";
import { CartItems } from "./CartItems";
import { CartSummary } from "./CartSummary";


export function CartContent() {
  const { items, isLoading } = useCart();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary border-b-2" />
      </div>
    );
  }

  if (items.length === 0) {
    return <CartEmpty />;
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <CartItems />
      <CartSummary />
    </div>
  );
}