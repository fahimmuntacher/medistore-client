import { categoryService } from "@/src/services";
import type { MedicineResponse } from "@/src/services/medicine-service";
import { useQuery } from "@tanstack/react-query";

type FetchParams = {
  search?: string;
  category?: string;
  maxPrice?: number;
  page?: number;
};

import api from "@/lib/axios";

export function useMedicines(params: FetchParams) {
  return useQuery<MedicineResponse, Error>({
    queryKey: ["medicines", params],
    queryFn: async () => {
      const query = new URLSearchParams(
        Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== "all")
          .map(([k, v]) => [k, String(v)]),
      ).toString();
      // console.log("useMedicines - params:", params);
      // console.log("useMedicines - query string:", query);

      const { data } = await api.get<{
        success: boolean;
        data: MedicineResponse;
      }>(`/medicines${query ? `?${query}` : ""}`);
      // console.log("useMedicines - API response:", data);
      // console.log("useMedicines - returning:", data.data);
      return data;
    },
  });
}

export function useCategories() {
  return useQuery<any[], Error>({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        // console.log("useCategories - fetching...");
        const res = await categoryService.getAllCategories();
        // console.log(" useCategories - raw response:", res);

        // Axios wraps response in .data, then our API has another .data wrapper
        const categories = res?.categories || [];
        // console.log("useCategories - extracted categories:", categories);
        return categories;
      } catch (error) {
        // console.error(" useCategories - error:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 30,
  });
}
