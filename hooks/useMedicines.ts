import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

type FetchParams = {
  search?: string;
  category?: string;
  maxPrice?: number;
  page?: number;
};

export function useMedicines(params: FetchParams) {
  return useQuery({
    queryKey: ["medicines", params],
    queryFn: async () => {
      const query = new URLSearchParams(
        Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== "all")
          .map(([k, v]) => [k, String(v)]),
      ).toString();

      const { data } = await api.get(`/medicines${query ? `?${query}` : ""}`);
      return data;
    },
    // keepPreviousData: true,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then((r) => r.data),
    staleTime: 1000 * 60 * 30,
  });
}
