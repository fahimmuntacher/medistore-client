"use client";

import { MedicineFilters } from "@/components/Medicines/MedicineFilters";
import { MedicineGrid } from "@/components/Medicines/MedicineGrid";
import { PaginationControls } from "@/components/Medicines/PaginationControls";
import { useCategories, useMedicines } from "@/hooks/useMedicines";
import { useState, useCallback } from "react";

export default function MedicinesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(100);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useMedicines({
    search,
    category,
    maxPrice,
    page,
  });
  const { data: categories, isLoading: catLoading } = useCategories();

  const resetPage = useCallback(() => setPage(1), []);

  const handleResetFilters = useCallback(() => {
    setSearch("");
    setCategory("all");
    setMaxPrice(100);
    setPage(1);
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Medicines</h1>

      <MedicineFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        categories={categories}
        isCategoriesLoading={catLoading}
        onReset={resetPage}
      />

      <MedicineGrid
        medicines={data?.medicines ?? []}
        isLoading={isLoading}
        isError={false}
        emptyMessage="No medicines found with current filters."
      />

      {data?.pagination && data.pagination.totalPages > 1 && (
        <PaginationControls
          currentPage={page}
          totalPages={data.pagination.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
