"use client";

import { Minus, Plus, X } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { CartItem, useCart } from "../providers/CartProvider";

type Props = {
  item: CartItem;
};

export function CartItemRow({ item }: Props) {
  const { incrementItem, decrementItem, removeFromCart } = useCart();

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  return (
    <div className="flex items-center gap-4 rounded-lg border p-3 bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="w-20 shrink-0">
        <AspectRatio ratio={1 / 1}>
          <img
            src={item.image}
            alt={item.name}
            className="object-cover rounded-md"
          />
        </AspectRatio>
      </div>
      <div className="flex-1 space-y-1">
        <h4 className="font-medium text-sm truncate">{item.name}</h4>
        <p className="text-xs text-muted-foreground">{formatPrice(item.price)} / unit</p>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => decrementItem(item.medicineId)}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-10 text-center font-medium">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => incrementItem(item.medicineId)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-right space-y-1 min-w-[80px]">
        <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={() => removeFromCart(item.medicineId)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}