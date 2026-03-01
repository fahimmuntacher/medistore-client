import { api } from "./api-client";

export interface Category {
  name: string;
  id: string;
  slug: string;
  icon: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const categoryService = {
  /**
   * Get all categories
   */
  async getAllCategories(params?: { limit?: number; page?: number }) {
    return api.get<{
      success: boolean;
      categories: Category[];
      pagination: any;
    }>("/categories", { params });
  },

  /**
   * Get single category details
   */
  async getCategoryById(categoryId: string) {
    return api.get<{ success: boolean; data: Category }>(
      `/categories/${categoryId}`,
    );
  },

  /**
   * Create new category (admin only)
   */
  async createCategory(data: Omit<Category, "id">) {
    return api.post("/categories", data);
  },

  /**
   * Update category (admin only)
   */
  async updateCategory(categoryId: string, data: Partial<Category>) {
    return api.put(`/categories/${categoryId}`, data);
  },

  /**
   * Delete category (admin only)
   */
  async deleteCategory(categoryId: string) {
    return api.delete(`/categories/${categoryId}`);
  },

  /**
   * Get medicines in a category
   */
  async getCategoryMedicines(categoryId: string, params?: any) {
    return api.get(`/categories/${categoryId}/medicines`, { params });
  },
};
