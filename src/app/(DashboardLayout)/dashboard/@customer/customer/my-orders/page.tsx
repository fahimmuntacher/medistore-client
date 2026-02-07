"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Loader2, Ban, Package, Calendar, Info } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/axios";
import { PaginationControls } from "@/components/Medicines/PaginationControls";
import { OrdersTableSkeleton } from "@/components/OrdersTableSkeleton";

/* ---------------- API ---------------- */

const fetchOrders = async (page: number) => {
  const res = await api.get("/orders", {
    params: {
      page,
      limit: 10,
    },
  });
  return res.data.data;
};

const cancelOrder = async (orderId: string) => {
  return api.put(`/orders/${orderId}`, { status: "CANCELLED" });
};

/* ---------------- COMPONENT ---------------- */

export default function CustomerOrder() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["my-orders", page],
    queryFn: () => fetchOrders(page),
    // keepPreviousData: true,
  });

  const orders = data?.orders ?? [];
  const meta = data?.meta || { page: 1, totalPage: 1, total: 0 };
//   console.log(meta);

  const { mutate: cancel, isPending } = useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      toast.success("Order cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          "Cancellation failed. Admin restriction might apply.",
      );
    },
  });

  if (isLoading && !data) {
    return (
      <OrdersTableSkeleton></OrdersTableSkeleton>
    );
  }

  return (
    <div className="md:p-8 min-h-screen space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
          <p className="text-muted-foreground">
            View and manage your medicine purchases.
          </p>
        </div>
        <Badge variant="outline">Total: {orders.length}</Badge>
      </div>

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="border border-dashed rounded-xl py-24 text-center">
          <Package className="mx-auto h-14 w-14 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No orders yet</h3>
          <p className="text-muted-foreground mt-1">
            You haven&apos;t ordered any medicine yet.
          </p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="rounded-xl border bg-card shadow-sm overflow-x-auto">
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Order ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {orders.map((order: any) => (
                  <TableRow
                    key={order.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{order.id.slice(0, 8)}
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">
                          {order.items[0]?.medicine?.name || "Medicine Item"}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          order.status === "DELIVERED"
                            ? "default"
                            : order.status === "CANCELLED"
                              ? "destructive"
                              : "secondary"
                        }
                        className="capitalize"
                      >
                        {order.status.toLowerCase()}
                      </Badge>
                    </TableCell>

                    <TableCell className="font-semibold">
                      ৳{order.totalAmount}
                    </TableCell>

                    <TableCell className="text-right">
                      {order.status === "PLACED" ? (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                            >
                              <Ban className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Cancel this order?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Keep Order</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => cancel(order.id)}
                                disabled={isPending}
                              >
                                {isPending && (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Yes, cancel
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <Info className="h-4 w-4 text-muted-foreground inline" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <PaginationControls
            currentPage={meta.page}
            totalPages={meta.totalPage}
            onPageChange={(newPage: any) => {
              if (!isLoading && newPage !== page) {
                setPage(newPage);
              }
            }}
          />
        </>
      )}
    </div>
  );
}
