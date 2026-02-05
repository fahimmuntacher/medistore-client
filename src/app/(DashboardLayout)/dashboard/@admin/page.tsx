"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import AdminOverviewUI from "@/components/admin/AdminOverviewUI";
import { Loader2, AlertCircle } from "lucide-react";
import { AdminOverviewSkeleton } from "@/components/admin/AdminOverviewSkeleton";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get("/dashboard/admin");
        setData(response.data);
      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <AdminOverviewSkeleton></AdminOverviewSkeleton>;
  }

  if (error) {
    return (
      <div className="h-[80vh] w-full flex flex-col items-center justify-center text-red-500 gap-2">
        <AlertCircle className="h-10 w-10" />
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-md text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return <AdminOverviewUI data={data} />;
}
