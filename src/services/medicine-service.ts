import { api } from "./api-client";

export interface MedicineListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  manufacturer: string;
  image: string;
  reviews: { rating: number }[];
}

export interface AddMedicine {
  name: string;
  description: string;
  price: number;
  stock: number;
  manufacturer: string;
  image: string;
  categoryId: string;
}

export interface MedicineResponse {
  medicines: Medicine[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const medicineService = {
  /**
   * Get all medicines (public listing)
   */
  async getAllMedicines(params?: MedicineListParams) {
    return api.get<{ success: boolean; data: MedicineResponse }>(
      "/medicines",
      {
        params,
      },
    );
  },

  /**
   * Get medicines for a specific seller
   */
  async getSellerMedicines(params?: MedicineListParams) {
    return api.get<{ success: boolean; data: MedicineResponse }>(
      "/medicines/seller",
      { params },
    );
  },

  /**
   * Get single medicine details
   */
  async getMedicineById(medicineId: string) {
    return api.get<{ success: boolean; data: Medicine }>(
      `/medicines/${medicineId}`,
    );
  },

  /**
   * Create new medicine (seller only)
   */
  async createMedicine(data: AddMedicine) {
    console.log("🔍 medicineService.createMedicine - sending:", data);
    console.log("🔍 medicineService.createMedicine - data keys:", Object.keys(data));
    try {
      const response = await api.post("/medicines", data);
      console.log("🔍 medicineService.createMedicine - success response:", response);
      return response;
    } catch (error: any) {
      // axios errors often include response data, include both for debugging
      console.error("🔍 medicineService.createMedicine - error:", error?.message || error);
      console.error("🔍 medicineService.createMedicine - error response:", error?.response?.data);
      // normalize so callers can safely read `.stack` and still access response data
      const payload = error?.response?.data || { message: error?.message || String(error) };
      let thrown: Error;
      if (payload instanceof Error) {
        thrown = payload;
      } else {
        thrown = new Error(payload.message || "Request failed");
        // attach the original stack if available for debugging
        if (error?.stack) thrown.stack = error.stack;
        // keep the response/body around too
        (thrown as any).data = payload;
      }
      throw thrown;
    }
  },

  /**
   * Update medicine details (seller only)
   */
  async updateMedicine(medicineId: string, data: Partial<Medicine>) {
    return api.put(`/medicines/${medicineId}`, data);
  },

  /**
   * Delete medicine (seller only)
   */
  async deleteMedicine(medicineId: string) {
    return api.delete(`/medicines/${medicineId}`);
  },

  /**
   * Get medicines by category
   */
  async getMedicinesByCategory(
    categoryId: string,
    params?: MedicineListParams,
  ) {
    return api.get<{ success: boolean; data: MedicineResponse }>(
      `/medicines/category/${categoryId}`,
      { params },
    );
  },

  /**
   * Search medicines
   */
  async searchMedicines(query: string, params?: MedicineListParams) {
    return api.get<{ success: boolean; data: MedicineResponse }>(
      "/medicines/search",
      { params: { ...params, search: query } },
    );
  },
};
