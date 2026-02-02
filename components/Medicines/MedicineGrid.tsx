"use client";

import { MedicineCard } from "./MedicineCard";
import { MedicineCardSkeleton } from "./MedicineCardSkeleton";

type Medicine = {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  manufacturer: string;
  image: string;
  reviews: { rating: number }[];
};

type Props = {
  medicines: Medicine[];
  isLoading: boolean;
  isError: boolean;
  emptyMessage?: string;
};

export function MedicineGrid({
  medicines,
  isLoading,
  isError,
  emptyMessage = "No medicines found with the current filters.",
}: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <MedicineCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16 text-lg text-destructive">
        Something went wrong while loading medicines. Please try again later.
      </div>
    );
  }

  if (medicines.length === 0) {
    return (
      <div className="text-center py-16 text-lg text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {medicines.map((medicine) => (
        <MedicineCard key={medicine.id} medicine={medicine} />
      ))}
    </div>
  );
}