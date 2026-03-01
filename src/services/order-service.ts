import { api } from "./api-client";
import { IOrder, OrderStatus, PaymentMethod, ShippingAddress } from "../types/order";

export interface OrderParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedOrders {
  orders: IOrder[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const orderService = {
  /**
   * Create a new order
   * @param orderData - Order details including shipping and payment info
   */
  async createOrder(orderData: {
    shippingAddress: ShippingAddress;
    paymentMethod: PaymentMethod;
    items: { medicineId: string; quantity: number }[];
  }) {
    return api.post<{ success: boolean; data: IOrder }>("/orders", orderData);
  },

  /**
   * Get all orders for current user
   */
  async getMyOrders(params?: OrderParams) {
    return api.get<{ success: boolean; data: PaginatedOrders }>("/orders", {
      params,
    });
  },

  /**
   * Get all orders (admin/seller view)
   */
  async getAllOrders(params?: OrderParams) {
    return api.get<{ success: boolean; data: PaginatedOrders }>(
      "/orders/all",
      { params }
    );
  },

  /**
   * Get single order details
   */
  async getOrderById(orderId: string) {
    return api.get<{ success: boolean; data: IOrder }>(
      `/orders/${orderId}`
    );
  },

  /**
   * Update order status (seller/admin only)
   */
  async updateOrderStatus(orderId: string, status: OrderStatus | string) {
    return api.put<{ success: boolean; data: IOrder }>(
      `/orders/${orderId}`,
      { status }
    );
  },

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string) {
    return api.put<{ success: boolean; data: IOrder }>(
      `/orders/${orderId}/cancel`,
      {}
    );
  },

  /**
   * Get seller's orders
   */
  async getSellerOrders(params?: OrderParams) {
    return api.get<{ success: boolean; data: PaginatedOrders }>(
      "/orders",
      { params }
    );
  },

  /**
   * Download order invoice/receipt
   */
  async downloadOrderInvoice(orderId: string) {
    return api.get(`/orders/${orderId}/invoice`);
  },
};
