/**
 * MIGRATION GUIDE: From Axios to Fetch-based Services
 * 
 * All API calls should now use the centralized service layer
 * which automatically handles credentials, caching, and error handling
 */

// ============================================
// BEFORE (using axios directly)
// ============================================
/*
import api from "@/lib/axios";

// In component
const { data } = useQuery({
  queryKey: ["orders"],
  queryFn: async () => {
    const res = await api.get("/orders", { params: { page, search } });
    return res.data.data;
  },
});
*/

// ============================================
// AFTER (using services)
// ============================================
/*
import { orderService } from "@/services";

// In component
const { data } = useQuery({
  queryKey: ["orders"],
  queryFn: () => orderService.getMyOrders({ page, search, limit: 10 }),
});
*/

// ============================================
// SERVICE EXAMPLES
// ============================================

/**
 * CART SERVICE
 * Replace: import api from "@/lib/axios"; await api.get("/cart")
 * With: import { cartService } from "@/services"; await cartService.getCart()
 */

import { cartService } from "@/services";

// Get cart
const cart = await cartService.getCart();

// Add item
await cartService.addItem("medicine-id", 2);

// Update item
await cartService.updateItem("cart-item-id", 5);

// Remove item
await cartService.removeItem("cart-item-id");

// Clear cart
await cartService.clearCart();

/**
 * ORDER SERVICE
 * Replace: import api from "@/lib/axios"; await api.get("/orders")
 * With: import { orderService } from "@/services"; await orderService.getMyOrders()
 */

import { orderService } from "@/services";

// Create order
await orderService.createOrder({
  shippingAddress: { fullName, phone, address, city, area, details },
  paymentMethod: "COD",
  items: [{ medicineId: "123", quantity: 2 }],
});

// Get my orders
const orders = await orderService.getMyOrders({ page: 1, limit: 10, search: "query" });

// Get single order
const order = await orderService.getOrderById("order-id");

// Update status
await orderService.updateOrderStatus("order-id", "SHIPPED");

/**
 * MEDICINE SERVICE
 * Replace: import api from "@/lib/axios"; await api.get("/medicines/seller")
 * With: import { medicineService } from "@/services"; await medicineService.getSellerMedicines()
 */

import { medicineService } from "@/services";

// Get all medicines
const medicines = await medicineService.getAllMedicines({ page: 1, limit: 10, search: "aspirin" });

// Get seller medicines
const sellerMeds = await medicineService.getSellerMedicines({ page: 1, limit: 10 });

// Get single medicine
const medicine = await medicineService.getMedicineById("med-id");

// Create medicine
await medicineService.createMedicine({
  name: "Aspirin",
  price: 100,
  manufacturer: "Beximco",
});

// Update medicine
await medicineService.updateMedicine("med-id", { price: 120 });

// Delete medicine
await medicineService.deleteMedicine("med-id");

/**
 * DASHBOARD SERVICE
 * Replace: import api from "@/lib/axios"; await api.get("/dashboard/seller")
 * With: import { dashboardService } from "@/services"; await dashboardService.getSellerDashboard()
 */

import { dashboardService } from "@/services";

// Get seller dashboard
const sellerStats = await dashboardService.getSellerDashboard();

// Get customer dashboard
const customerStats = await dashboardService.getCustomerDashboard();

// Get admin dashboard
const adminStats = await dashboardService.getAdminDashboard();

/**
 * REVIEW SERVICE
 * Replace: import api from "@/lib/axios"; await api.post("/reviews", data)
 * With: import { reviewService } from "@/services"; await reviewService.createReview(data)
 */

import { reviewService } from "@/services";

// Create review
await reviewService.createReview({
  medicineId: "med-id",
  orderId: "order-id",
  rating: 5,
  comment: "Great medicine!",
});

// Get medicine reviews
const reviews = await reviewService.getMedicineReviews("med-id");

// Get user reviews
const myReviews = await reviewService.getUserReviews({ page: 1, limit: 10 });

// Update review
await reviewService.updateReview("review-id", { rating: 4, comment: "Updated" });

// Delete review
await reviewService.deleteReview("review-id");

/**
 * CATEGORY SERVICE
 */

import { categoryService } from "@/services";

// Get all categories
const categories = await categoryService.getAllCategories();

// Get category medicines
const catMedicines = await categoryService.getCategoryMedicines("cat-id");

/**
 * REACT QUERY EXAMPLES
 * (with automatic credential handling and caching)
 */

import { useQuery } from "@tanstack/react-query";
import { orderService, medicineService, dashboardService } from "@/services";

// Query with services
export function useSellerOrders(page: number) {
  return useQuery({
    queryKey: ["seller-orders", page],
    queryFn: () => orderService.getSellerOrders({ page, limit: 10 }),
  });
}

export function useSellerMedicines(page: number, search: string) {
  return useQuery({
    queryKey: ["seller-medicines", page, search],
    queryFn: () =>
      medicineService.getSellerMedicines({ page, limit: 10, search }),
  });
}

export function useSellerDashboard() {
  return useQuery({
    queryKey: ["seller-dashboard"],
    queryFn: () => dashboardService.getSellerDashboard(),
  });
}

// Mutation with services
import { useMutation } from "@tanstack/react-query";

export function useUpdateOrderStatus() {
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      orderService.updateOrderStatus(id, status),
  });
}

export function useDeleteMedicine() {
  return useMutation({
    mutationFn: (medicineId: string) =>
      medicineService.deleteMedicine(medicineId),
  });
}

/**
 * KEY ADVANTAGES OF NEW SERVICES:
 * ✅ Automatic credential handling (credentials: 'include')
 * ✅ Consistent error handling
 * ✅ Built-in type safety
 * ✅ Centralized API configuration
 * ✅ Easy to test and mock
 * ✅ Automatic cache busting (cache: 'no-store')
 * ✅ Query parameter handling
 * ✅ Proper cookie/session management for cross-origin requests
 */
