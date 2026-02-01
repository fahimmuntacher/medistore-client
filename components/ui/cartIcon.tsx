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
import { useCart } from "@/src/Context/Cartcontext";
import { ShoppingCartSheet } from "../shopping-cart1";


export function CartIcon() {
  const cart = useCart();
  if (!cart) return null; 

  const { totalItems } = cart;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />

          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-white">
              {totalItems > 9 ? "9+" : totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        <ShoppingCartSheet />
      </SheetContent>
    </Sheet>
  );
}
