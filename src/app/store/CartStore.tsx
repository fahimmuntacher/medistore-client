import { create } from "zustand";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";

interface CartStore {
  items: any[];
  total: number;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (medicineId: string, price : number, isLoggedIn: boolean) => Promise<void>;
  updateQty: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  total: 0,
  loading: false,

  fetchCart: async () => {
    try {
      const res = await api.get("/cart");
      if (res.data.success) {
        set({ 
          items: res.data.data.items, 
          total: res.data.data.total 
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
      await api.post("/cart", { medicineId, price, quantity: 1 });
      await get().fetchCart();
      toast.success("Medicine added to cart");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add item");
    } finally {
      set({ loading: false });
    }
  },

  updateQty: async (itemId, quantity) => {
    console.log(itemId);
    try {
      await api.patch(`/cart/${itemId}`, { quantity });
      await get().fetchCart();
    } catch (error) {
        console.log(error);
      toast.error("Failed to update quantity");
    }
  },

  removeItem: async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);
      await get().fetchCart();
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  }
}));