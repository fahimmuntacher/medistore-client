"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import * as Icons from "lucide-react";
import { Loader2, ChevronRight, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "../ui/skeleton";

export const CategoryGrid = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories?limit=8");
      return res.data.categories;
    },
  });

  return (
    <section className="py-16 container mx-auto px-4 sm:px-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
            Shop by Category
          </h2>
          <p className="text-muted-foreground">
            Find exactly what you need quickly from our verified categories.
          </p>
        </div>
        <Button
          variant="outline"
          className="hidden md:flex rounded-full border-primary text-primary hover:bg-primary hover:text-white transition-all"
        >
          View All Categories <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="p-8 rounded-[2rem] border bg-card shadow-sm space-y-5"
            >
              {/* Icon Skeleton */}
              <div className="flex justify-center">
                <Skeleton className="h-16 w-16 rounded-2xl" />
              </div>

              {/* Title Skeleton */}
              <div className="flex justify-center">
                <Skeleton className="h-4 w-24 rounded-md" />
              </div>

              {/* Small Text Skeleton */}
              <div className="flex justify-center">
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Dynamic Category Grid */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {data?.map((cat: any) => {
            const IconComponent = (Icons as any)[cat.icon] || Pill;

            return (
              <div key={cat.id} className="group cursor-pointer">
                <div className="relative flex flex-col items-center p-8 rounded-[2rem] bg-card border shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
                  {/* Background Decoration Pattern */}
                  <div className="absolute -right-4 -top-4 text-primary/5 group-hover:text-primary/10 transition-colors">
                    <IconComponent className="h-24 w-24 rotate-12" />
                  </div>

                  {/* Icon Container */}
                  <div className="relative z-10 p-5 rounded-2xl bg-primary/10 text-primary mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-500 ease-out shadow-inner">
                    <IconComponent className="h-8 w-8 transition-transform duration-500 group-hover:rotate-[360deg]" />
                  </div>

                  {/* Category Name */}
                  <span className="relative z-10 font-bold text-slate-800 dark:text-slate-200 text-center text-sm md:text-base tracking-tight">
                    {cat.name}
                  </span>

                  <p className="relative z-10 text-[10px] uppercase font-bold text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore items
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mobile Only View All Button */}
      <div className="mt-8 flex md:hidden justify-center">
        <Button variant="outline" className="w-full rounded-xl">
          View All Categories
        </Button>
      </div>
    </section>
  );
};
