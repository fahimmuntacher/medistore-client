"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation"; // ✅ Use navigation for App Router
import React from "react";

// ✅ Define the interface for your props
interface SuccessModalProps {
  orderId: string;
}

// ✅ Destructure orderId from the props object
const SucessModal = ({ orderId }: SuccessModalProps) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-in fade-in zoom-in duration-500">
      <div className="bg-primary/10 p-6 rounded-full mb-6 text-primary">
        <CheckCircle2 className="h-20 w-20" />
      </div>
      <h1 className="text-4xl font-black mb-2 text-foreground">
        Order Confirmed!
      </h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Thank you for your purchase. Your order has been received. Order ID:{" "}
        <span className="text-primary font-mono font-bold">
          #{orderId.slice(-8)}
        </span>
        . Our delivery partner will reach out to you shortly.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button variant="outline" onClick={() => router.push("/medicines")}>
          Continue Shopping
        </Button>
        <Button onClick={() => router.push("/dashboard/orders")}>View My Orders</Button>
      </div>
    </div>
  );
};

export default SucessModal;