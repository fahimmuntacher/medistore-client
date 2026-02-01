"use client";

import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useCart } from "@/src/Context/Cartcontext";

// ─── Types ────────────────────────────────────────────────────────────────────

type Medicine = {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  stock: number;
  manufacturer: string;
  image: string;
  category: { id: string; name: string; slug: string };
  reviews: { rating: number }[];
};

type MedicinesResponse = {
  medicines: Medicine[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

type Category = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

type FetchParams = {
  search?: string;
  category?: string;
  maxPrice?: number;
  page?: number;
};

const MAX_PRICE_LIMIT = 100;

// ─── API helper ───────────────────────────────────────────────────────────────

const fetchMedicines = async ({
  search,
  category,
  maxPrice,
  page = 1,
}: FetchParams): Promise<MedicinesResponse> => {
  const params = new URLSearchParams();

  if (search?.trim()) params.append("search", search.trim());
  if (category && category !== "all") params.append("category", category);
  if (maxPrice !== undefined) params.append("maxPrice", String(maxPrice));
  params.append("page", String(page));

  const { data } = await api.get<MedicinesResponse>(
    `/medicines?${params.toString()}`,
  );
  return data;
};

// ─── Utility ──────────────────────────────────────────────────────────────────

const getAverageRating = (reviews: Medicine["reviews"]): number => {
  if (!reviews || reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const MedicineCardSkeleton = () => (
  <div className="rounded-lg border bg-white shadow-sm animate-pulse">
    <div className="h-48 bg-gray-200 rounded-t-lg" />
    <div className="p-4 flex flex-col gap-3">
      <div className="h-5 w-3/4 bg-gray-200 rounded" />
      <div className="h-4 w-full bg-gray-100 rounded" />
      <div className="h-4 w-1/3 bg-gray-100 rounded" />
      <div className="h-4 w-1/2 bg-gray-100 rounded" />
      <div className="mt-auto h-9 w-full bg-gray-200 rounded" />
    </div>
  </div>
);

const MedicineCard: React.FC<{ medicine: Medicine }> = ({ medicine }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const avgRating = getAverageRating(medicine.reviews);
  const hasDiscount =
    medicine.discountPrice > 0 && medicine.discountPrice < medicine.price;

  const handleAddToCart = () => {
    addToCart({
      id: medicine.id,
      name: medicine.name,
      image: medicine.image,
      price: hasDiscount ? medicine.discountPrice : medicine.price,
    });

    // Show "Added ✓" for 1.5 s then reset
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    
  };

  return (
    <Card className="hover:shadow-lg transition-shadow flex flex-col">
      <CardHeader className="p-0">
        <img
          src={medicine.image}
          alt={medicine.name}
          className="w-full h-48 object-cover rounded-t-md"
        />
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-2">
        <CardTitle className="text-lg">{medicine.name}</CardTitle>
        <CardDescription>{medicine.description}</CardDescription>

        <div className="flex items-center gap-2">
          {hasDiscount ? (
            <>
              <span className="line-through text-gray-400 text-sm">
                ${medicine.price.toFixed(2)}
              </span>
              <span className="font-semibold text-green-600">
                ${medicine.discountPrice.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="font-semibold">${medicine.price.toFixed(2)}</span>
          )}
        </div>

        <p className="text-sm text-gray-600">
          Stock:{" "}
          <span
            className={medicine.stock === 0 ? "text-red-500 font-medium" : ""}
          >
            {medicine.stock === 0 ? "Out of stock" : medicine.stock}
          </span>
        </p>
        <p className="text-sm text-gray-600">
          Manufacturer: {medicine.manufacturer}
        </p>

        {avgRating > 0 && (
          <p className="text-yellow-500 font-medium text-sm">
            {avgRating.toFixed(1)} ⭐ ({medicine.reviews.length} reviews)
          </p>
        )}
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          disabled={medicine.stock === 0 || added}
          onClick={handleAddToCart}
        >
          {medicine.stock === 0
            ? "Out of Stock"
            : added
              ? "Added ✓"
              : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
};

/** Windowed pagination */
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const windowSize = 5;
  const halfWindow = Math.floor(windowSize / 2);
  let start = Math.max(1, currentPage - halfWindow);
  let end = Math.min(totalPages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <Button
        variant="outline"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ← Prev
      </Button>

      {start > 1 && (
        <>
          <Button variant="outline" onClick={() => onPageChange(1)}>
            1
          </Button>
          {start > 2 && <span className="px-1">…</span>}
        </>
      )}

      {pages.map((p) => (
        <Button
          key={p}
          variant={currentPage === p ? "default" : "outline"}
          onClick={() => onPageChange(p)}
        >
          {p}
        </Button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1">…</span>}
          <Button variant="outline" onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next →
      </Button>
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

const MedicinesPage = () => {
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(MAX_PRICE_LIMIT);
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isError } = useQuery<MedicinesResponse>({
    queryKey: ["medicines", search, category, maxPrice, page],
    queryFn: () => fetchMedicines({ search, category, maxPrice, page }),
  });

  const { data: categories, isLoading: isCategoriesLoading } = useQuery<
    Category[]
  >({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get<Category[]>("/categories");
      return data;
    },
  });

  const handleCategoryChange = useCallback((value: string) => {
    setCategory(value);
    setPage(1);
  }, []);

  const handleSliderChange = useCallback((value: number[]) => {
    setMaxPrice(value[0]);
    setPage(1);
  }, []);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  }, []);

  return (
    <div className="py-6 px-2.5 container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Medicines Store</h1>

      {/* ── Filters ── */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-wrap gap-4 mb-8 items-end"
      >
        <Input
          placeholder="Search medicine…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />

        <Select onValueChange={handleCategoryChange} value={category}>
          <SelectTrigger className="w-48" disabled={isCategoriesLoading}>
            <SelectValue
              placeholder={isCategoriesLoading ? "Loading…" : "Select Category"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-col w-64">
          <span className="text-sm mb-1">
            Max Price: ${maxPrice.toFixed(2)}
          </span>
          <Slider
            value={[maxPrice]}
            onValueChange={handleSliderChange}
            min={0}
            max={MAX_PRICE_LIMIT}
            step={1}
          />
        </div>
      </form>

      {/* ── Medicine grid ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <MedicineCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-red-500 text-lg">
          Something went wrong while loading medicines. Please try again.
        </div>
      ) : !data?.medicines || data.medicines.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg">
          No medicines found matching your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.medicines.map((medicine) => (
            <MedicineCard key={medicine.id} medicine={medicine} />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {data?.pagination && (
        <Pagination
          currentPage={page}
          totalPages={data.pagination.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default MedicinesPage;
