"use client";

import { useQuery } from "@tanstack/react-query";
import SellerOverviewUI from "@/components/seller/SellerOverviewUI";
import { Loader2, Store } from "lucide-react";
import { SellerOverviewSkeleton } from "@/components/seller/SellerOverviewSkeleton";
import { dashboardService } from "@/src/services";

export default function SellerDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["seller-dashboard"],
    queryFn: () => dashboardService.getSellerDashboard(),
  });

  // console.log(data);
  if (isLoading) {
    return <SellerOverviewSkeleton />;
  }

  if (!data) return <div className="p-8 text-center">No data found.</div>;

  return <SellerOverviewUI data={data} />;
}
