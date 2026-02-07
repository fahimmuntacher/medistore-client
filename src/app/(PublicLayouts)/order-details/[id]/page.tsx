"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  Package,
  User,
  MapPin,
  CreditCard,
  ArrowLeft,
  Calendar,
  Phone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { OrderDetailsSkeleton } from "@/components/OrderDetailsSkeleton";

/* ---------------- API Call ---------------- */
const fetchOrderDetails = async (id: string) => {
  const res = await api.get(`/orders/${id}`);
  return res.data?.data || res.data;
};

/* ---------------- Component ---------------- */
const OrderDetailsPage = () => {
  const params = useParams();
  const orderId = params.id as string;

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderDetails(orderId),
    enabled: !!orderId,
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "default";
      case "CANCELLED":
        return "destructive";
      case "SHIPPED":
        return "outline";
      case "PROCESSING":
        return "secondary";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return <OrderDetailsSkeleton />;
  }

  if (error || !order) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center text-center">
        <Package className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The order you're looking for doesn't exist or you don't have access.
        </p>
        <Button asChild>
          <Link href="/dashboard/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 text-foreground">
      {/* Top Navigation */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          asChild
          className="rounded-full h-9 w-9 shrink-0"
        >
          <Link href="/dashboard/customer/my-orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight truncate">
            Order #{order.id?.slice(0, 8).toUpperCase()}
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <Badge
          className="ml-auto px-4 py-1 capitalize tracking-wide whitespace-nowrap"
          variant={getStatusVariant(order.status) as any}
        >
          {order.status?.toLowerCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content: Items List */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground p-6 shadow-sm">
            <h3 className="font-semibold mb-4 flex items-center gap-2 border-b pb-4">
              <Package className="h-4 w-4 text-primary" /> Ordered Items
            </h3>
            <div className="divide-y border-b">
              {order.items?.map((item: any) => (
                <div
                  key={item.id}
                  className="py-4 flex justify-between items-center group"
                >
                  <div className="space-y-1">
                    <p className="font-medium group-hover:text-primary transition-colors">
                      {item.medicine?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Quantity:{" "}
                      <span className="font-semibold text-foreground">
                        {item.quantity}
                      </span>{" "}
                      × ৳{item.price}
                    </p>
                  </div>
                  <p className="font-bold">৳{item.quantity * item.price}</p>
                </div>
              ))}
            </div>

            {/* Summary calculation */}
            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Items Subtotal</span>
                <span className="text-foreground">৳{order.totalAmount}</span>
              </div>
              <div className="flex justify-between font-bold text-xl pt-4 border-t">
                <span>Total Amount</span>
                <span className="text-primary font-extrabold">
                  ৳{order.totalAmount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Card */}
          <div className="rounded-xl border bg-card text-card-foreground p-5 shadow-sm space-y-3">
            <h3 className="font-semibold flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wider">
              <User className="h-4 w-4" /> Customer
            </h3>
            <div className="pt-1">
              <p className="font-bold">{order.customer?.name}</p>
              <p className="text-sm text-muted-foreground truncate">
                {order.customer?.email}
              </p>
            </div>
          </div>

          {/* Shipping Card */}
          <div className="rounded-xl border bg-card text-card-foreground p-5 shadow-sm space-y-3">
            <h3 className="font-semibold flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wider">
              <MapPin className="h-4 w-4" /> Shipping to
            </h3>
            <div className="text-sm space-y-2 leading-relaxed">
              <p className="font-bold">{order.shippingAddress?.fullName}</p>
              <p className="text-muted-foreground italic bg-muted/50 p-2 rounded-md">
                "{order.shippingAddress?.details}"
              </p>
              <p className="font-medium">
                {order.shippingAddress?.area}, {order.shippingAddress?.city}
              </p>
              <div className="pt-2 flex items-center gap-2 text-primary font-bold">
                <div className="bg-primary/10 p-1.5 rounded-md">
                  <Phone className="h-3.5 w-3.5" />
                </div>
                {order.shippingAddress?.phone}
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-xl border bg-card text-card-foreground p-5 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Payment</span>
              </div>
              <Badge
                variant="outline"
                className="bg-primary/5 text-primary border-primary/20"
              >
                {order.paymentMethod}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
