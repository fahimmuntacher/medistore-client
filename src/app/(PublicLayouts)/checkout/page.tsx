"use client";

import { useCartStore } from "@/src/app/store/CartStore";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Minus,
  Plus,
  Trash2,
  Truck,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { OrderService } from "@/src/services/order.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { FieldError } from "@/components/ui/field";
import SucessModal from "./SucessModal";

const addressSchema = z.object({
  fullName: z.string().min(3, "Full Name must be at least 3 characters"),
  phone: z
    .string()
    .regex(
      /^(?:\+88|88)?(01[3-9]\d{8})$/,
      "Enter a valid Bangladeshi phone number",
    ),
  city: z.string().min(2, "Enter City Name"),
  area: z.string().min(2, "Enter Area Name"),
  details: z.string().min(5, "Enter your address in detail"),
});

export default function CheckoutPage() {
  // ✅ Added clearCart from your store
  const { items, total, updateQty, removeItem, fetchCart, clearCart } =
    useCartStore();
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      fullName: "",
      phone: "",
      city: "",
      area: "",
      details: "",
    },
    validators: {
      onChange: addressSchema,
    },
    onSubmit: async ({ value }) => {
      if (items.length === 0) {
        toast.error("Your cart is empty!");
        return;
      }

      const toastId = toast.loading("Processing your order...");

      try {
        const payload = {
          shippingAddress: value,
          paymentMethod: "COD",
          items: items.map((item) => ({
            medicineId: item.medicineId,
            quantity: item.quantity,
          })),
        };

        const res = await OrderService.createOrder(payload as any);

        await clearCart();
        setOrderId(res.data.id);
        toast.success("Order Placed Successfully!", { id: toastId });
      } catch (error: any) {
        console.error("Order Error:", error);
        toast.error(
          error.message || "Failed to place order. Please try again.",
          { id: toastId },
        );
      }
    },
  });

  // SUCCESS UI
  if (orderId) {
    return <SucessModal orderId={orderId}></SucessModal>;
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl text-foreground">
      <h1 className="text-3xl font-bold mb-8">Secure Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <Card className="bg-card border-border shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Truck className="h-5 w-5" /> Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <form.Field name="fullName">
                    {(field) => (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input
                          className="bg-background border-input"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Enter your full name"
                        />
                        {field.state.meta.errors.length > 0 && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="phone">
                    {(field) => (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Phone Number
                        </label>
                        <Input
                          className="bg-background border-input"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="e.g. 017XXXXXXXX"
                        />
                        {field.state.meta.errors.length > 0 && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <form.Field name="city">
                    {(field) => (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">City</label>
                        <Input
                          className="bg-background border-input"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Select city"
                        />
                        {field.state.meta.errors.length > 0 && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="area">
                    {(field) => (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Area</label>
                        <Input
                          className="bg-background border-input"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Select area"
                        />
                        {field.state.meta.errors.length > 0 && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>

                <form.Field name="details">
                  {(field) => (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Detailed Address
                      </label>
                      <Input
                        className="bg-background border-input"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="House number, Street name, etc."
                      />
                      {field.state.meta.errors.length > 0 && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </div>
                  )}
                </form.Field>

                <div className="pt-6">
                  <CardTitle className="text-base flex items-center gap-2 mb-4 text-foreground">
                    <CreditCard className="h-5 w-5 text-primary" /> Payment
                    Method
                  </CardTitle>
                  <div className="p-4 border-2 border-primary/40 rounded-xl bg-primary/5 flex justify-between items-center border-dashed">
                    <span className="font-semibold text-sm">
                      Cash on Delivery (COD)
                    </span>
                    <ShieldCheck className="text-primary h-6 w-6" />
                  </div>
                </div>

                <form.Subscribe selector={(state) => [state.isSubmitting]}>
                  {([isSubmitting]) => (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          className="w-full h-14 text-xl font-bold rounded-xl shadow-lg"
                          disabled={items.length === 0 || isSubmitting}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="animate-spin h-5 w-5" />{" "}
                              Processing...
                            </span>
                          ) : (
                            `Place Order (৳${total.toFixed(2)})`
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-background border-border">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Confirm Your Order
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to place this order? Please
                            review your shipping details before confirming.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Review</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => form.handleSubmit()}
                            className="bg-primary text-primary-foreground"
                          >
                            Confirm Order
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </form.Subscribe>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right side Order Summary */}
        <div className="lg:col-span-5">
          <Card className="sticky top-24 bg-card border-border shadow-md border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 group bg-muted/50 border border-border/50 p-2.5 rounded-2xl transition-colors hover:bg-muted"
                >
                  <div className="h-16 w-16 rounded-md overflow-hidden shrink-0 ">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-primary font-bold text-sm">
                      ৳{item.price}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded-md bg-background">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="px-2 text-xs">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <Separator />
            <CardFooter className="flex flex-col gap-3 pt-6">
              <div className="flex justify-between w-full text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>৳{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-full text-lg font-bold">
                <span>Total</span>
                <span className="text-primary font-black">
                  ৳{total.toFixed(2)}
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
