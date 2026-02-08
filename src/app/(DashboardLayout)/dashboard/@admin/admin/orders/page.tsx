"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Eye,
  MapPin,
  Phone,
  CreditCard,
  Package,
  Loader2,
  Pill,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { OrdersTableSkeleton } from "@/components/OrdersTableSkeleton";
import { PaginationControls } from "@/components/Medicines/PaginationControls";

/* ---------------- API Function ---------------- */
const fetchAdminOrders = async (page: number, search: string) => {
  const res = await api.get("/orders", {
    params: {
      page,
      limit: 10,
      search,
    },
  });
  return res.data.data;
};

const AdminOrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading} = useQuery({
    queryKey: ["admin-orders", page, searchTerm],
    queryFn: () => fetchAdminOrders(page, searchTerm),

  });

  const orders = data?.orders ?? [];
  const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLACED": return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "PROCESSING": return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      case "SHIPPED": return "bg-purple-100 text-purple-700 hover:bg-purple-100";
      case "DELIVERED": return "bg-green-100 text-green-700 hover:bg-green-100";
      case "CANCELLED": return "bg-red-100 text-red-700 hover:bg-red-100";
      default: return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
  };

  

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">All Orders</h1>
          
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Order ID..."
            className="pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[150px]">Order ID</TableHead>
              <TableHead>Customer Info</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">View Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="p-0">
                  <OrdersTableSkeleton />
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order: any) => (
                <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold uppercase font-mono text-primary">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {new Intl.DateTimeFormat("en-GB").format(new Date(order.createdAt))}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{order.customer?.name}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" /> {order.customer?.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-slate-700">
                    ৳{order.totalAmount}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(order.status)} border-none shadow-none px-3 py-1`}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 gap-2 border-primary/20 hover:bg-primary/5">
                          <Eye className="h-4 w-4" /> View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2 text-xl font-bold border-b pb-4">
                            <Package className="h-6 w-6 text-primary" /> Order Summary
                          </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                          {/* Shipping & Payment Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                              <h4 className="flex items-center gap-2 font-bold text-sm mb-3 text-slate-700">
                                <MapPin className="h-4 w-4 text-red-500" /> Delivery Address
                              </h4>
                              <div className="space-y-1 text-sm">
                                <p className="font-semibold text-slate-800">{order.shippingAddress?.fullName}</p>
                                <p className="text-slate-600">{order.shippingAddress?.details}</p>
                                <p className="text-slate-600">{order.shippingAddress?.area}, {order.shippingAddress?.city}</p>
                                <p className="flex items-center gap-2 mt-2 font-medium text-primary">
                                  <Phone className="h-3 w-3" /> {order.shippingAddress?.phone}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="p-3 border rounded-md">
                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Payment Method</p>
                                <p className="text-sm font-medium flex items-center gap-2 mt-1 uppercase">
                                  <CreditCard className="h-4 w-4 text-slate-500" /> {order.paymentMethod}
                                </p>
                              </div>
                              <div className="p-3 border rounded-md bg-primary/5">
                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Total Paid</p>
                                <p className="text-lg font-bold text-primary mt-1">৳{order.totalAmount}</p>
                              </div>
                            </div>
                          </div>

                          {/* Ordered Items */}
                          <div className="space-y-3">
                            <h4 className="flex items-center gap-2 font-bold text-sm text-slate-700">
                              <Pill className="h-4 w-4 text-blue-500" /> Medicines List
                            </h4>
                            <div className="space-y-2">
                              {order.items?.map((item: any) => (
                                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border bg-white shadow-sm">
                                  <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-800">{item.medicine?.name}</span>
                                    <span className="text-[11px] text-muted-foreground uppercase">{item.medicine?.manufacturer}</span>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs font-medium text-slate-500">Qty: {item.quantity}</p>
                                    <p className="font-bold text-primary">৳{item.price * item.quantity}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Order Status Badge at Bottom */}
                          <div className="flex items-center justify-between pt-4 border-t">
                             <span className="text-sm font-medium text-slate-500">Current Order Status:</span>
                             <Badge className={`${getStatusColor(order.status)} border-none shadow-none px-4 py-1.5`}>
                                {order.status}
                             </Badge>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination Section */}
      <PaginationControls
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(newPage: number) => {
          if (!isLoading && newPage !== page) {
            setPage(newPage);
          }
        }}
      />
    </div>
  );
};

export default AdminOrdersPage;