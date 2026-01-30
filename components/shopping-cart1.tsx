"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

const DEFAULT_ITEMS: CartItem[] = [
  {
    id: "1",
    name: "Minimalist Beige Sneakers",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Minimalist-Beige-Sneakers-2.png",
    price: 120,
    quantity: 1,
  },
  {
    id: "2",
    name: "Embroidered Blue Top",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Woman-in-Embroidered-Blue-Top-2.png",
    price: 140,
    quantity: 1,
  },
];

export function ShoppingCartSheet() {
  const [items, setItems] = useState(DEFAULT_ITEMS);

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  if (items.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <p className="mb-4 text-muted-foreground">Your cart is empty</p>
        <Button>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col px-2">
      <div className="flex-1 space-y-4 overflow-auto py-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-lg border p-3"
          >
            <div className="w-16 shrink-0">
              <AspectRatio ratio={1}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full rounded-md object-cover"
                />
              </AspectRatio>
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                Qty: {item.quantity}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold">
                {formatPrice(item.price)}
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(item.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Separator/>

      <div className="space-y-4 pt-4 p-5">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <Button size="lg" className="w-full">
          Checkout
        </Button>
      </div>
    </div>
  );
}
