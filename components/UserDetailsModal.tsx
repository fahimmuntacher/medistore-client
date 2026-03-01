"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  ShieldCheck,
  ShieldAlert,
  User as UserIcon,
  Mail,
  ShoppingBag,
  Stethoscope,
  Star,
  Loader2,
} from "lucide-react";

interface UserDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null; // এখন আমরা শুধু ID নেব
}

export const UserDetailsModal = ({
  isOpen,
  onOpenChange,
  userId,
}: UserDetailsModalProps) => {
  // Single User Data Fetching
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-details", userId],
    queryFn: async () => {
      if (!userId) return null;
      // Note: We'll need to create a userService if user endpoints are needed
      // For now, this component needs to be updated based on your user API structure
      return null;
    },
    enabled: !!userId && isOpen,
  });

  const user = data;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            User Profile Details
          </DialogTitle>
          <DialogDescription>
            Full account overview and statistics.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground italic">
              Getting user data...
            </p>
          </div>
        ) : isError ? (
          <div className="py-10 text-center text-destructive">
            <p>Failed to load user details. Please try again.</p>
          </div>
        ) : user ? (
          <div className="space-y-6 py-2 animate-in fade-in duration-300">
            {/* Profile Header */}
            <div className="flex items-center gap-5 p-2 rounded-lg bg-muted/30">
              <Avatar className="h-20 w-20 border-4 border-background shadow-sm">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {user.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <h3 className="text-lg font-bold leading-none">{user.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> {user.email}
                </p>
                <div className="flex gap-2 pt-1">
                  <Badge variant={user.isBanned ? "destructive" : "secondary"}>
                    {user.isBanned ? "Banned" : "Active"}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {user.role?.toLowerCase()}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Dynamic Stats Based on Role */}
            <div className="grid grid-cols-2 gap-3">
              {user.role === "CUSTOMER" ? (
                <>
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                      <ShoppingBag className="h-4 w-4" />
                      <span className="text-[10px] font-bold uppercase">
                        Orders
                      </span>
                    </div>
                    <p className="text-2xl font-bold">
                      {user.totalOrders || 0}
                    </p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-xl border border-purple-100 dark:border-purple-900/30">
                    <div className="flex items-center gap-2 text-purple-600 mb-1">
                      <Star className="h-4 w-4" />
                      <span className="text-[10px] font-bold uppercase">
                        Reviews
                      </span>
                    </div>
                    <p className="text-2xl font-bold">
                      {user.totalReviews || 0}
                    </p>
                  </div>
                </>
              ) : (
                <div className="col-span-2 bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                  <div className="flex items-center gap-2 text-emerald-600 mb-1">
                    <Stethoscope className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase">
                      Active Medicines
                    </span>
                  </div>
                  <p className="text-3xl font-bold">
                    {user.totalActiveMedicines || 0}
                  </p>
                </div>
              )}
            </div>

            <Separator />

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 px-1">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground uppercase">
                  User ID
                </span>
                <p className="text-xs font-mono bg-muted p-1 rounded truncate">
                  {user.id}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground uppercase">
                  Joined
                </span>
                <p className="text-sm font-semibold">
                  {new Date(user.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {user.isBanned && (
              <div className="bg-destructive/10 p-3 rounded-lg flex gap-3 border border-destructive/20 text-destructive">
                <ShieldAlert className="h-5 w-5 shrink-0" />
                <p className="text-xs leading-relaxed">
                  This account is currently restricted by admin policy.
                </p>
              </div>
            )}
          </div>
        ) : null}

        <div className="flex justify-end pt-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
