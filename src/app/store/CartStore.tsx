import { create } from "zustand";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { cartService } from "@/src/services";

interface CartStore {
  items: any[];
  total: number;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (medicineId: string, price : number, isLoggedIn: boolean) => Promise<void>;
  updateQty: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  total: 0,
  loading: false,

  fetchCart: async () => {
    try {
      const cart = await cartService.getCart();
      if (cart) {
        set({ 
          items: cart.items || [], 
          total: cart.total || 0 
        });
      }
    } catch (err) {
      console.error("Cart fetch error", err);
      set({ items: [], total: 0 });
    }
  },

  addItem: async (medicineId, price, isLoggedIn) => {
    if (!isLoggedIn) {
      toast.error("Please login to add medicines to cart");
      return;
    }

    try {
      set({ loading: true });
      await cartService.addItem(medicineId, 1);
      await get().fetchCart();
      toast.success("Medicine added to cart");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add item");
    } finally {
      set({ loading: false });
    }
  },

  updateQty: async (itemId, quantity) => {
    console.log(itemId);
    try {
      await cartService.updateItem(itemId, quantity);
      await get().fetchCart();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update quantity");
    }
  },

  removeItem: async (itemId) => {
    try {
      await cartService.removeItem(itemId);
      await get().fetchCart();
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  },

  clearCart: async () => {
    try {
      await cartService.clearCart();
      set({ items: [], total: 0 }); // Locally reset state after successful API call
    } catch (error) {
      console.error("Failed to clear cart", error);
      toast.error("Order placed, but failed to clear cart session.");
    }
  },
}));