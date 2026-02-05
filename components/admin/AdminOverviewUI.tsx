"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Pill, ShoppingCart, TrendingUp } from "lucide-react";
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

interface AdminOverviewUIProps {
  data: {
    stats: {
      totalUsers: number;
      totalSellers: number;
      totalMedicines: number;
      totalOrders: number;
      totalRevenue: number;
    };
    recentOrders: any[];
  };
}

export default function AdminOverviewUI({ data }: AdminOverviewUIProps) {
  const { stats, recentOrders } = data;

  const statCards = [
    {
      title: "Total Revenue",
      value: `৳${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      description: "Lifetime earnings",
      gradient: "from-emerald-500/10 to-emerald-500/0",
      color: "text-emerald-600",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      description: "Orders placed",
      gradient: "from-blue-500/10 to-blue-500/0",
      color: "text-blue-600",
    },
    {
      title: "Total Medicines",
      value: stats.totalMedicines,
      icon: Pill,
      description: "In inventory",
      gradient: "from-purple-500/10 to-purple-500/0",
      color: "text-purple-600",
    },
    {
      title: "Total Sellers",
      value: stats.totalSellers,
      icon: Store,
      description: "Active partners",
      gradient: "from-orange-500/10 to-orange-500/0",
      color: "text-orange-600",
    },
  ];

  const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
        <p className="text-muted-foreground mt-1">
          Monitor your store performance and recent activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Card
            key={i}
            className={cn(
              "relative overflow-hidden border shadow-sm transition-all",
              "hover:shadow-md hover:-translate-y-0.5",
              "bg-gradient-to-br",
              stat.gradient,
            )}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="border shadow-sm rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
          <Badge variant="secondary">Latest 5</Badge>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Customer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {recentOrders.map((order: any) => (
                  <TableRow
                    key={order.id}
                    className="hover:bg-muted/40 transition"
                  >
                    <TableCell>
                      <div className="font-medium">{order.customer.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {order.customer.email}
                      </div>
                    </TableCell>

                    <TableCell className="text-sm">
                      {order.shippingAddress.city}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("capitalize", statusColor(order.status))}
                      >
                        {order.status.toLowerCase()}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right font-semibold text-emerald-600">
                      ৳{order.totalAmount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
