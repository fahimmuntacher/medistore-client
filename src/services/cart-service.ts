import { api } from "./api-client";
import { Cart } from "../types/cart";

export const cartService = {
  /**
   * Get current user's cart
   */
  async getCart(): Promise<Cart> {
    const response = await api.get<{ success: boolean; data: Cart }>("/cart");
    return response.data;
  },

  /**
   * Add item to cart
   * @param medicineId - The medicine ID to add
   * @param quantity - Quantity to add (default: 1)
   */
  async addItem(medicineId: string, quantity: number = 1) {
    return api.post("/cart", { medicineId, quantity });
  },

  /**
   * Update cart item quantity
   * @param itemId - The cart item ID
   * @param quantity - New quantity
   */
  async updateItem(itemId: string, quantity: number) {
    return api.patch(`/cart/${itemId}`, { quantity });
  },

  /**
   * Remove item from cart
   * @param itemId - The cart item ID to remove
   */
  async removeItem(itemId: string) {
    return api.delete(`/cart/${itemId}`);
  },

  /**
   * Clear entire cart
   */
  async clearCart() {
    return api.delete("/cart/clear");
  },
};
