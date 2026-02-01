"use client";

import { X, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/src/Context/Cartcontext";
import Link from "next/link";

export function ShoppingCartSheet() {
  const {
    items,
    subtotal,
    incrementItem,
    decrementItem,
    removeFromCart,
    placeOrder,
  } = useCart();

  const [isOrdering, setIsOrdering] = useState(false);
  const [orderStatus, setOrderStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  const handleCheckout = async () => {
    setIsOrdering(true);
    setOrderStatus("idle");
    try {
      await placeOrder("COD");
      setOrderStatus("success");
    } catch {
      setOrderStatus("error");
    } finally {
      setIsOrdering(false);
    }
  };

  // ── empty state ──────────────────────────────────────────────────────────

  if (items.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center gap-4 px-6">
        {orderStatus === "success" ? (
          <>
            <div className="text-green-600 text-5xl">✓</div>
            <p className="text-lg font-semibold text-green-600">
              Order placed!
            </p>
            <p className="text-sm text-muted-foreground">
              Thank you for your purchase. Your order is being processed.
            </p>
          </>
        ) : (
          <>
            <p className="text-muted-foreground">Your cart is empty</p>
            <Link href="/medicines">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
          </>
        )}
      </div>
    );
  }

  // ── cart items ───────────────────────────────────────────────────────────

  return (
    <div className="flex h-full flex-col px-2">
      <div className="flex-1 space-y-3 overflow-auto py-4">
        {items.map((item) => (
          <div
            key={item.medicineId}
            className="flex items-center gap-3 rounded-lg border p-3"
          >
            {/* Thumbnail */}
            <div className="w-16 shrink-0">
              <AspectRatio ratio={1}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full rounded-md object-cover"
                />
              </AspectRatio>
            </div>

            {/* Name + price */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatPrice(item.price)} each
              </p>
            </div>

            {/* Qty controls */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => decrementItem(item.medicineId)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-sm w-6 text-center font-medium">
                {item.quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => incrementItem(item.medicineId)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {/* Line total */}
            <p className="text-sm font-semibold w-16 text-right">
              {formatPrice(item.price * item.quantity)}
            </p>

            {/* Remove */}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-red-500"
              onClick={() => removeFromCart(item.medicineId)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-4 pt-4 pb-2 px-2">
        <div className="flex justify-between font-semibold text-base">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {/* Error banner */}
        {orderStatus === "error" && (
          <p className="text-xs text-red-500 text-center">
            Something went wrong. Please try again.
          </p>
        )}

        <Button
          size="lg"
          className="w-full"
          onClick={handleCheckout}
          disabled={isOrdering}
        >
          {isOrdering ? "Placing order…" : "Checkout"}
        </Button>
      </div>
    </div>
  );
}
