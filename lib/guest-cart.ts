import { Cart } from "@/src/types/cart"

const KEY = "guest_cart"

export function getGuestCart(): Cart {
  if (typeof window === "undefined") return { items: [], total: 0 }
  return JSON.parse(localStorage.getItem(KEY) || '{"items":[],"total":0}')
}

export function saveGuestCart(cart: Cart) {
  localStorage.setItem(KEY, JSON.stringify(cart))
}

export function clearGuestCart() {
  localStorage.removeItem(KEY)
}
