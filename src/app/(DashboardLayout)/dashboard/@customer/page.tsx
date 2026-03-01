"use client";

import { useQuery } from "@tanstack/react-query";
import CustomerOverviewUI from "@/components/customer/CustomerOverviewUI";
import CustomerOverviewSkeleton from "@/components/customer/CustomerOverviewSkeleton";
import { dashboardService } from "@/src/services";

export default function CustomerDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["customer-dashboard"],
    queryFn: () => dashboardService.getCustomerDashboard(),
  });

  if (isLoading) {
    return <CustomerOverviewSkeleton />;
  }

  if (!data)
    return <div className="p-10 text-center">Failed to load data.</div>;

  return <CustomerOverviewUI data={data.data} />;
}
