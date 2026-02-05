"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingBag,
  CreditCard,
  MapPin,
  Clock,
  ChevronRight,
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
import Link from "next/link";

interface CustomerOverviewUIProps {
  data: {
    stats: {
      totalOrders: number;
      totalSpent: number;
    };
    recentOrders: any[];
  };
}

export default function CustomerOverviewUI({ data }: CustomerOverviewUIProps) {
  const { stats, recentOrders } = data;

  return (
    <div className="p-6 md:p-8 min-h-screen space-y-8 bg-background">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back!
        </h1>
        <p className="text-muted-foreground">
          Track your orders and manage your healthcare needs.
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-none shadow-sm bg-primary text-primary-foreground">
          <CardHeader className="pb-2 flex justify-between items-center">
            <CardTitle className="text-sm font-medium text-primary-foreground">
              Total Spent
            </CardTitle>
            <CreditCard className="h-4 w-4 text-primary-foreground/70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-foreground">
              ৳{stats.totalSpent.toLocaleString()}
            </div>
            <p className="text-xs text-primary-foreground/70 mt-1">
              Across all your purchases
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2 flex justify-between items-center">
            <CardTitle className="text-sm font-medium text-foreground">
              Orders Placed
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {stats.totalOrders}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Items you've ordered
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2 flex justify-between items-center">
            <CardTitle className="text-sm font-medium text-foreground">
              Default Shipping
            </CardTitle>
            <MapPin className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-md font-semibold text-foreground truncate">
              {recentOrders[0]?.shippingAddress.city || "No Address Set"}
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {recentOrders[0]?.shippingAddress.area || "Update your profile"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Order History Table */}
    <Card className="border-none shadow-sm">
  <CardHeader className="flex justify-between items-center">
    <div className="space-y-1">
      <CardTitle className="text-foreground">Recent Orders</CardTitle>
      <p className="text-sm text-muted-foreground">
        Detailed history of your latest medicine orders.
      </p>
    </div>
    <Link
      href="/dashboard/customer/my-orders"
      className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
    >
      View All <ChevronRight className="h-4 w-4" />
    </Link>
  </CardHeader>

  <CardContent>
    {/* Mobile scrollable container */}
    <div className="overflow-x-auto">
      <Table className="w-full min-w-[600px]">
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="w-[120px] text-foreground">Order ID</TableHead>
            <TableHead className="text-foreground">Date</TableHead>
            <TableHead className="text-foreground">Status</TableHead>
            <TableHead className="text-right text-foreground">Total</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <TableRow key={order.id} className="hover:bg-muted/20 transition-colors">
                <TableCell className="font-mono text-xs text-muted-foreground">
                  #{order.id.slice(0, 8)}
                </TableCell>
                <TableCell className="text-sm text-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="capitalize text-[11px] px-2 py-0"
                  >
                    {order.status.toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-semibold text-foreground">
                  ৳{order.totalAmount}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                No orders found yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  </CardContent>
</Card>

    </div>
  );
}
