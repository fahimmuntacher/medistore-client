"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";

export const SidebarProfileCard = () => {
  const { user, loading } = useAuth();
    console.log(user);
  if (loading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
            <div className="space-y-1">
              <div className="h-3 w-24 bg-muted rounded animate-pulse" />
              <div className="h-2 w-16 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild size="lg" >
          <Link
            href="/my-profile"
            className="flex items-center gap-3"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col text-left leading-tight">
              <span className="text-sm font-medium">
                {user.name ?? "User"}
              </span>
              <span className="text-xs text-muted-foreground capitalize">
                {user.role}
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
