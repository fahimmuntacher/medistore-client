"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  ShoppingCart,
  Pill,
  Truck,
  ArrowUpRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SellerOverviewUIProps {
  data: {
    totalOrders: number;
    totalItemsSold: number;
    totalMedicines: number;
    totalRevenue: number;
    recentOrders: any[];
  };
}

export default function SellerOverviewUI({ data }: SellerOverviewUIProps) {
  const {
    totalOrders,
    totalItemsSold,
    totalMedicines,
    totalRevenue,
    recentOrders,
  } = data;

  const sellerStats = [
    {
      title: "Revenue",
      value: `৳${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      gradient: "from-primary/10 to-primary/5",
      iconClass: "text-primary",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: Truck,
      gradient: "from-secondary/10 to-secondary/5",
      iconClass: "text-secondary",
    },
    {
      title: "Items Sold",
      value: totalItemsSold,
      icon: ShoppingCart,
      gradient: "from-success/10 to-success/5",
      iconClass: "text-success",
    },
    {
      title: "Medicines Listed",
      value: totalMedicines,
      icon: Pill,
      gradient: "from-accent/10 to-accent/5",
      iconClass: "text-accent",
    },
  ];

  const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-success/10 text-success border-none";
      case "pending":
        return "bg-warning/10 text-warning border-none";
      case "cancelled":
        return "bg-destructive/10 text-destructive border-none";
      default:
        return "bg-primary/10 text-primary border-none";
    }
  };

  return (
    <div className="p-6 md:p-8 min-h-screen bg-background flex flex-col space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Seller Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Monitor your sales and manage inventory.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {sellerStats.map((stat, i) => (
          <Card
            key={i}
            className={cn(
              "relative overflow-hidden border shadow-sm transition-transform hover:shadow-md hover:-translate-y-0.5",
              "bg-gradient-to-br",
              stat.gradient,
            )}
          >
            <CardHeader className="pb-2 flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={cn("h-5 w-5", stat.iconClass)} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Width Table */}
      <Card className="border shadow-sm rounded-xl w-full">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-foreground">
            Incoming Orders
          </CardTitle>
          <Badge variant="outline">New</Badge>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Order ID</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="hover:bg-muted/40 transition"
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        #{order.id.slice(0, 8)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-foreground">
                          {order.shippingAddress.city}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {order.shippingAddress.area}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        ৳{order.totalAmount}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          className={cn(
                            "capitalize text-[10px]",
                            statusColor(order.status),
                          )}
                        >
                          {order.status.toLowerCase()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-10 text-muted-foreground"
                    >
                      No orders found yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Action & Shipping Info stacked below table */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* Quick Action */}
        <Card className="border-none shadow-sm bg-primary text-primary-foreground hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="text-primary-foreground/90">
              Quick Action
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-primary-foreground/70">
              Add new medicines to boost your sales.
            </p>
            <button className="w-full bg-primary-foreground text-primary font-semibold py-2 rounded-md hover:bg-primary-muted transition-colors flex items-center justify-center gap-2">
              Add Medicine <ArrowUpRight className="h-4 w-4" />
            </button>
          </CardContent>
        </Card>

        {/* Shipping Summary */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Shipping Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center text-sm border-b pb-2">
              <span className="text-muted-foreground">Last Order From:</span>
              <span className="font-medium text-foreground">
                {recentOrders[0]?.shippingAddress?.city || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Preferred Method:</span>
              <span className="font-medium text-foreground">
                {recentOrders[0]?.paymentMethod || "N/A"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
