import api from "@/lib/axios"
import { Cart } from "../types/cart"


export const CartService = {
  async get(): Promise<Cart> {
    const res = await api.get("/cart")
    return res.data.data
  },

  async add(medicineId: string, quantity = 1) {
    await api.post("/cart", { medicineId, quantity })
  },

  async update(itemId: string, quantity: number) {
    await api.patch(`/cart/${itemId}`, { quantity })
  },

  async remove(itemId: string) {
    await api.delete(`/cart/${itemId}`)
  },

  async clear() {
    await api.delete("/cart/clear")
  },
}

