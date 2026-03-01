/**
 * Centralized API services export
 * Use these services instead of making direct axios/fetch calls
 */

export { api } from "./api-client";
export { cartService } from "./cart-service";
export { medicineService, type MedicineListParams, type Medicine, type MedicineResponse } from "./medicine-service";
export { orderService, type OrderParams, type PaginatedOrders } from "./order-service";
export { dashboardService, type SellerDashboardStats, type CustomerDashboardStats, type AdminDashboardStats } from "./dashboard-service";
export { reviewService, type ReviewData, type Review, type ReviewStats } from "./review-service";
export { categoryService, type Category } from "./category-service";

// Note: userService is server-only and should be imported directly in server components
// import { userService } from "@/services/user.service";

