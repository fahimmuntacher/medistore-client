"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import CustomerOverviewUI from "@/components/customer/CustomerOverviewUI";
import CustomerOverviewSkeleton from "@/components/customer/CustomerOverviewSkeleton";

export default function CustomerDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/dashboard/customer");
        setData(response.data);
      } catch (err) {
        console.error("Error fetching customer data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  if (loading) {
    return <CustomerOverviewSkeleton></CustomerOverviewSkeleton>;
  }

  if (!data)
    return <div className="p-10 text-center">Failed to load data.</div>;

  return <CustomerOverviewUI data={data} />;
}
