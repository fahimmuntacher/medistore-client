import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

type Props = {
  afterSuccess?: boolean;
};

export function CartEmpty({ afterSuccess = false }: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      {afterSuccess ? (
        <>
          <div className="rounded-full bg-green-100 p-4">
            <ShoppingBag className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-green-600">Order Placed Successfully!</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Thank you for your purchase. Your order is being processed and will be delivered soon.
          </p>
          <Link href="/orders">
            <Button variant="outline" className="mt-2">View Orders</Button>
          </Link>
        </>
      ) : (
        <>
          <div className="rounded-full bg-muted p-4">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">Your Cart is Empty</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Looks like you haven&apos;t added any medicines yet. Let&apos;s change that!
          </p>
          <Link href="/medicines">
            <Button className="mt-2">Browse Medicines</Button>
          </Link>
        </>
      )}
    </div>
  );
}