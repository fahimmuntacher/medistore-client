"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function OrdersTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl  bg-card overflow-x-auto">
      <Table className="w-full">
        {/* <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead>Order ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader> */}

        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>

              <TableCell>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </TableCell>

              <TableCell>
                <Skeleton className="h-6 w-24 rounded-full" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>

              <TableCell className="text-right">
                <Skeleton className="h-8 w-20 ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
