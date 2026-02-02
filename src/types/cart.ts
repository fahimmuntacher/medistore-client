export interface CartItem {
  id: string
  medicineId: string
  name: string
  image: string
  price: number
  quantity: number
  subtotal: number
}

export interface Cart {
  items: CartItem[]
  total: number
}
