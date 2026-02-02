"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { CreditCard, DollarSign } from "lucide-react";
import { useCart } from "../providers/CartProvider";
import { CartEmpty } from "./CartEmpty";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function CartSummary() {
  const { subtotal, placeOrder } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      await placeOrder(paymentMethod);
      setSuccess(true);
    } catch (err) {
      setError("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return <CartEmpty afterSuccess={true} />; // Reuse empty for success state
  }

  return (
    <div className="p-4 border-t bg-background shadow-inner">
      <div className="space-y-4">
        <div className="flex justify-between text-lg font-semibold">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant={paymentMethod === "COD" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setPaymentMethod("COD")}
          >
            <DollarSign className="mr-2 h-4 w-4" /> COD
          </Button>
          <Button
            variant={paymentMethod === "ONLINE" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setPaymentMethod("ONLINE")}
          >
            <CreditCard className="mr-2 h-4 w-4" /> Online
          </Button>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Separator />
        <Button
          size="lg"
          className="w-full font-semibold"
          onClick={handlePlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </div>
  );
}