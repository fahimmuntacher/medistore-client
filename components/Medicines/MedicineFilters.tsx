"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type FiltersProps = {
  search: string;
  setSearch: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  maxPrice: number;
  setMaxPrice: (v: number) => void;
  categories: { id: string; name: string; slug: string }[] | undefined;
  isCategoriesLoading: boolean;
  onReset: () => void;
};

export function MedicineFilters({
  search,
  setSearch,
  category,
  setCategory,
  maxPrice,
  setMaxPrice,
  categories: categoriesData,
  isCategoriesLoading,
  onReset,
}: FiltersProps) {
  // console.log("Category :", categoriesData);
  const hasFilters = search || category !== "all" || maxPrice < 100;

  const handleReset = useCallback(() => {
    setSearch("");
    setCategory("all");
    setMaxPrice(100);
    onReset();
  }, [setSearch, setCategory, setMaxPrice, onReset]);

  // prefer data passed from parent to avoid duplicate queries
  const categoryList = categoriesData || [];
  return (
    <div className="flex flex-wrap gap-4 mb-8 items-end">
      <div className="flex-1 min-w-[220px]">
        <Input
          placeholder="Search medicines..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="w-48">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>

            {categoryList.map((c: any) => (
              <SelectItem key={c.id} value={c.slug}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-64 space-y-1.5">
        <div className="flex justify-between text-sm">
          <span>Max price</span>
          <span>৳ {maxPrice}</span>
        </div>
        <Slider
          value={[maxPrice]}
          min={0}
          max={1500}
          step={1}
          onValueChange={(v) => setMaxPrice(v[0])}
        />
      </div>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <X className="mr-2 h-4 w-4" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
