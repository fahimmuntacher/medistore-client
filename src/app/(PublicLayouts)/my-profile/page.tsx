"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Mail, ShieldCheck, CalendarDays, User, Pencil } from "lucide-react";
import { useUser } from "@/hooks/useSession";

export default function ProfilePage() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-40 rounded-xl bg-muted animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-40 rounded-xl bg-muted animate-pulse" />
          <div className="h-40 rounded-xl bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-20 px-5 sm:px-0">
      {/* Profile Header */}
      <Card className="rounded-2xl">
        <CardContent className="flex flex-col sm:flex-row items-center gap-6 p-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.image as string} alt={user.name} />
            <AvatarFallback>
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>

            <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-2">
              <Badge className="capitalize">{user.role!.toLowerCase()}</Badge>
              {user.emailVerified && (
                <Badge variant="outline" className="gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Verified
                </Badge>
              )}
            </div>
          </div>

          <Button variant="outline" className="gap-2">
            <Pencil className="h-4 w-4" />
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Info */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email
              </span>
              <span className="font-medium">{user.email}</span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2">
                <CalendarDays className="h-4 w-4" /> Joined
              </span>
              <span className="font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2">
                <CalendarDays className="h-4 w-4" /> Last Updated
              </span>
              <span className="font-medium">
                {new Date(user.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Role & Status */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Security & Role</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Account Role</span>
              <Badge variant="secondary" className="capitalize">
                {user.role!.toLowerCase()}
              </Badge>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Email Status</span>
              {user.emailVerified ? (
                <Badge className="gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="destructive">Not Verified</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
