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
import { Loader2, Ban, Package, Calendar, Info, Star } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/axios";
import { OrdersTableSkeleton } from "@/components/OrdersTableSkeleton";
import { PaginationControls } from "@/components/Medicines/PaginationControls";
import { ReviewModal } from "./ReviewModal";

const fetchOrders = async (page: number) => {
  const res = await api.get("/orders", {
    params: { page, limit: 10 },
  });
  return res.data.data;
};

const cancelOrder = async (orderId: string) => {
  return api.put(`/orders/${orderId}`, { status: "CANCELLED" });
};

export default function CustomerOrder() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["my-orders", page],
    queryFn: () => fetchOrders(page),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const orders = data?.orders ?? [];
  const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 };

  const { mutate: cancel, isPending } = useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      toast.success("Order cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Cancellation failed.");
    },
  });

  if (isLoading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="md:p-8 min-h-screen space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
          <p className="text-muted-foreground">
            View and manage your medicine purchases.
          </p>
        </div>
        <Badge variant="outline">Total: {pagination.total}</Badge>
      </div>

      {orders.length === 0 ? (
        <div className="border border-dashed rounded-xl py-24 text-center">
          <Package className="mx-auto h-14 w-14 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No orders yet</h3>
        </div>
      ) : (
        <>
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
                {isFetching ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <OrdersTableSkeleton />
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order: any) => (
                    <TableRow
                      key={order.id}
                      className="hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() =>
                        (window.location.href = `/order-details/${order.id}`)
                      }
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        #{order.id.slice(-8)}
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">
                            {order.items[0]?.medicine?.name || "Medicine"}
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

                      <TableCell
                        className="text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-end items-center gap-2">
                          {order.status === "DELIVERED" ? (
                            (() => {
                              const medicineId = order.items[0]?.medicineId;
                              const review = order.reviews?.find(
                                (r: any) => r.medicineId === medicineId,
                              );

                              return review ? (
                                <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full border border-yellow-200">
                                  <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                                  <span className="text-xs font-bold">
                                    {review.rating}/5
                                  </span>
                                </div>
                              ) : (
                                <ReviewModal
                                  medicineId={medicineId}
                                  orderId={order.id}
                                  medicineName={order.items[0]?.medicine?.name}
                                />
                              );
                            })()
                          ) : order.status === "PLACED" ? (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive"
                                >
                                  <Ban className="h-4 w-4 mr-1" /> Cancel
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Cancel Order?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Keep Order
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => cancel(order.id)}
                                    disabled={isPending}
                                  >
                                    Yes, cancel
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ) : (
                            <Button variant="ghost" size="sm" disabled>
                              <Info className="h-4 w-4 mr-1" /> No Action
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <PaginationControls
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(newPage: number) => {
              if (!isLoading && newPage !== page) setPage(newPage);
            }}
          />
        </>
      )}
    </div>
  );
}
