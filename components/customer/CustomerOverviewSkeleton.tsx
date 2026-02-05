"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CustomerOverviewSkeleton() {
  return (
    <div className="p-6 md:p-8 min-h-screen space-y-8 bg-background animate-pulse">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="h-6 w-1/3 rounded bg-muted" />
        <div className="h-4 w-1/2 rounded bg-muted" />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="border-none shadow-sm bg-muted/20">
            <CardHeader className="pb-2 flex justify-between items-center">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-4 w-4 rounded bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 rounded bg-muted mb-1" />
              <div className="h-3 w-24 rounded bg-muted/70" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Orders Table */}
      <Card className="border-none shadow-sm">
        <CardHeader className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="h-4 w-40 rounded bg-muted" />
            <div className="h-3 w-56 rounded bg-muted/70" />
          </div>
          <div className="h-4 w-20 rounded bg-muted" />
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table className="w-full min-w-[600px]">
              <TableHeader>
                <TableRow className="bg-muted/40">
                  {["Order ID", "Date", "Status", "Total"].map((col, i) => (
                    <TableHead key={i} className="text-foreground">
                      <div className="h-3 w-16 rounded bg-muted" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="transition-colors">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-4 rounded bg-muted/20 w-full" />
                      </TableCell>
                    ))}
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
