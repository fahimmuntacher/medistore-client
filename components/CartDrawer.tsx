"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Trash2, Pill } from "lucide-react";
import { useCartStore } from "@/src/app/store/CartStore";

export function CartDrawer() {
  const { items, total, updateQty, removeItem } = useCartStore();
//  console.log(items);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-[10px] h-5 w-5 rounded-full flex items-center justify-center font-bold">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl">
            Cart
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground italic">
              <ShoppingCart className="h-12 w-12 mb-2 opacity-20" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4 px-5">
              {items.map((item) => (
                
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-muted/40 rounded-xl border border-border/50"
                >
                  <img
                    src={item.image}
                    className="h-16 w-16 rounded-lg object-cover border"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-blue-600 font-bold text-sm">
                      ৳{item.price}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded-lg bg-muted">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-xs font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:text-red-600 h-8 w-8"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t pt-6 space-y-4 px-5 pb-2.5">
            <div className="flex justify-between items-end">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-2xl font-bold">৳{total.toFixed(2)}</span>
            </div>
            <Button className="w-full h-12 text-lg font-bold">
              Proceed to Checkout
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
