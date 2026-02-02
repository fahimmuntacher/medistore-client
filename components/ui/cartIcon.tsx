"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/src/providers/CartProvider";
import { CartContent } from "@/src/cart/CartContent";

export function CartIcon() {
  const { totalItems, isLoading } = useCart();
  const count = isLoading ? 0 : totalItems;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group">
          <ShoppingCart className="h-5 w-5 transition-colors group-hover:text-primary" />
          {count > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground shadow-md animate-in zoom-in-95">
              {count > 99 ? "99+" : count}
            </span>
          )}
          <span className="sr-only">Open cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[400px] md:w-[450px] flex flex-col border-l-0 shadow-2xl">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-xl font-bold tracking-tight">Your Cart</SheetTitle>
        </SheetHeader>
        <CartContent />
      </SheetContent>
    </Sheet>
  );
}