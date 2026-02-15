"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Eye, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Medicine } from "@/src/types/medicine";
import { MedicineCard } from "../Medicines/MedicineCard";
import { MedicineCardSkeleton } from "../Medicines/MedicineCardSkeleton";

export const FeaturedMedicines = () => {
  const { data: medicines, isLoading } = useQuery({
    queryKey: ["featured-medicines"],
    queryFn: async () => {
      const res = await api.get("/medicines?limit=8");

      return res.data.medicines || res.data.data;
    },
  });

  return (
    <section className="container px-4 sm:px-0 pb-10">
      <div className="">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6 text-center md:text-left">
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Featured <span className="text-primary">Medicines</span>
            </h2>
            <p className="text-muted-foreground max-w-md">
              Top-rated and essential healthcare products delivered with care to
              your doorstep.
            </p>
          </div>
          <Link href="/medicines">
            <Button
              variant="outline"
              className="rounded-full border-primary text-primary hover:bg-primary hover:text-white transition-all group"
            >
              View All Shop{" "}
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <MedicineCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {medicines?.map((medicine: Medicine) => (
              <div
                key={medicine.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
              >
                <MedicineCard medicine={medicine} />
              </div>
            ))}
          </div>
        )}

        {!isLoading && medicines?.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed">
            <p className="text-muted-foreground">
              No medicines found at the moment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
