"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios"; 
import SellerOverviewUI from "@/components/seller/SellerOverviewUI";
import { Loader2, Store } from "lucide-react";
import { SellerOverviewSkeleton } from "@/components/seller/SellerOverviewSkeleton";

export default function SellerDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerStats = async () => {
      try {
        setLoading(true);
        // নিশ্চিত করুন আপনার ব্যাকএন্ডে এই রুটটি আছে
        const response = await api.get("/dashboard/seller");
        setData(response.data);
      } catch (err) {
        console.error("Seller Stats Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerStats();
  }, []);

  if (loading) {
    return (<SellerOverviewSkeleton></SellerOverviewSkeleton>)
  }

  if (!data) return <div className="p-8 text-center">No data found.</div>;

  return <SellerOverviewUI data={data} />;
}