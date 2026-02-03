import api from "@/lib/axios"; // Apnar banano axios instance
import { IOrder, OrderStatus, PaymentMethod, ShippingAddress } from "../types/order";

// Pagination ar filtering er jonno type
interface OrderParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Backend theke asha response er type
interface PaginatedOrders {
  orders: IOrder[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const OrderService = {
  /**
   * Create a new order
   * @param orderData { shippingAddress, paymentMethod, items }
   */
  createOrder: async (orderData: {
    shippingAddress: ShippingAddress;
    paymentMethod: PaymentMethod;
    items: { medicineId: string; quantity: number }[];
  }) => {
    // Backend JSON shippingAddress expect korche, tai object-e thaka bhalo
    const response = await api.post("/orders", orderData);
    return response.data;
  },

  /**
   * Get all orders (For Admin or User list)
   */
  getAllOrders: async (params?: OrderParams) => {
    const response = await api.get<{ success: boolean; data: PaginatedOrders }>(
      "/orders",
      { params }
    );
    return response.data.data;
  },

  /**
   * Get a single order details by ID
   */
  getSingleOrder: async (orderId: string) => {
    const response = await api.get<IOrder>(`/orders/${orderId}`);
    return response.data;
  },

  /**
   * Update order status (Admin only)
   */
  updateOrderStatus: async (orderId: string, status: OrderStatus) => {
    const response = await api.put<{ success: boolean; data: IOrder }>(
      `/orders/${orderId}`,
      { status }
    );
    return response.data;
  },
};