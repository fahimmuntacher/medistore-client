"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function OrderDetailsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      {/* Top Nav */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-9 rounded-full" />

        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>

        <Skeleton className="ml-auto h-6 w-24 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Items */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <Skeleton className="h-5 w-40 mb-6" />

            <div className="divide-y">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="py-4 flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>

          {/* Address */}
          <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          {/* Payment */}
          <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
