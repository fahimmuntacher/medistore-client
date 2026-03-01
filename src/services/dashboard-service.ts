import { api } from "./api-client";

export interface SellerDashboardStats {
  totalOrders: number;
  totalItemsSold: number;
  totalMedicines: number;
  totalRevenue: number;
  recentOrders: any[];
}

export interface CustomerDashboardStats {
  stats: {
    totalOrders: number;
    totalSpent: number;
  };
  recentOrders: any[];
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalRevenue: number;
  totalOrders: number;
  totalMedicines: number;
  recentOrders: any[];
  [key: string]: any;
}

export const dashboardService = {
  /**
   * Get seller dashboard statistics
   */
  async getSellerDashboard() {
    return api.get<{ success: boolean; data: SellerDashboardStats }>(
      "/dashboard/seller",
    );
  },

  /**
   * Get customer dashboard statistics
   */
  async getCustomerDashboard() {
    return api.get<{ success: boolean; data: CustomerDashboardStats }>(
      "/dashboard/customer",
    );
  },

  /**
   * Get admin dashboard statistics
   */
  async getAdminDashboard() {
    return api.get<{ success: boolean; data: AdminDashboardStats }>(
      "/dashboard/admin",
    );
  },

  /**
   * Get dashboard overview (universal endpoint)
   */
  async getDashboardOverview() {
    return api.get<{ success: boolean; data: any }>("/dashboard/overview");
  },

  /**
   * Get sales analytics
   */
  async getSalesAnalytics(period?: "week" | "month" | "year") {
    return api.get("/dashboard/analytics/sales", { params: { period } });
  },

  /**
   * Get user activity
   */
  async getUserActivity() {
    return api.get("/dashboard/activity");
  },
};
