"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { CartItemRow } from "./CartItemRow";
import { useCart } from "../providers/CartProvider";



export function CartItems() {
  const { items } = useCart();

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {items.map((item) => (
          <CartItemRow key={item.medicineId} item={item} />
        ))}
      </div>
    </ScrollArea>
  );
}