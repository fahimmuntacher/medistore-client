"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "use-debounce";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  UserX,
  UserCheck,
  Mail,
  Loader2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const AdminUserPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<"SELLER" | "CUSTOMER" | "">("");

  // Alert Dialog States
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [debouncedSearch] = useDebounce(search, 1000);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["users", debouncedSearch, role],
    queryFn: async () => {
      const res = await api.get("/users", {
        params: {
          search: debouncedSearch || undefined,
          role: role || undefined,
        },
      });
      return res.data;
    },
  });

  const users = data?.data?.users || [];

  // ban & unbaned mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({
      id,
      currentStatus,
    }: {
      id: string;
      currentStatus: boolean;
    }) => {
      // আপনার এপিআই অনুযায়ী ডাটা পাঠানো (isBanned true থাকলে ACTIVE করবে, নাহলে BANNED)
      return api.put(`/users/${id}`, {
        isBanned: !currentStatus,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User status updated successfully");
      setIsAlertOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update status");
      setIsAlertOpen(false);
    },
  });

  const handleStatusClick = (user: any) => {
    setSelectedUser(user);
    setIsAlertOpen(true);
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground text-sm">
            Manage all customers and sellers.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary pr-10"
          />
          {isFetching && (
            <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value as any)}
          className="w-full md:w-48 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Users</option>
          <option value="SELLER">Seller</option>
          <option value="CUSTOMER">Customer</option>
        </select>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isFetching
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}>
                      <div className="h-10 w-full animate-pulse bg-muted rounded" />
                    </TableCell>
                  </TableRow>
                ))
              : users.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border">
                          <AvatarImage src={user?.image} />
                          <AvatarFallback>
                            {user.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {user.name}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {user.role.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.isBanned ? (
                        <Badge variant="destructive">Banned</Badge>
                      ) : (
                        <Badge className="bg-green-500 hover:bg-green-600">
                          Active
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />

                          {/* Dynamic button*/}
                          {user.isBanned ? (
                            <DropdownMenuItem
                              className="text-green-600 cursor-pointer"
                              onClick={() => handleStatusClick(user)}
                            >
                              <UserCheck className="mr-2 h-4 w-4" /> Unban User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="text-red-600 cursor-pointer"
                              onClick={() => handleStatusClick(user)}
                            >
                              <UserX className="mr-2 h-4 w-4" /> Ban User
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {/* Alert Dialog for Confirmation */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to {selectedUser?.isBanned ? "unban" : "ban"}{" "}
              <strong>{selectedUser?.name}</strong>.
              {selectedUser?.isBanned
                ? " This will restore their access to the platform."
                : " This will restrict their access to the platform immediately."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={
                selectedUser?.isBanned
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
              onClick={() =>
                toggleStatusMutation.mutate({
                  id: selectedUser.id,
                  currentStatus: selectedUser.isBanned,
                })
              }
              disabled={toggleStatusMutation.isPending}
            >
              {toggleStatusMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Confirm {selectedUser?.isBanned ? "Unban" : "Ban"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminUserPage;
