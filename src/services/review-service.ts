import { api } from "./api-client";

export interface ReviewData {
  medicineId: string;
  orderId: string;
  rating: number; // 1-5
  comment?: string;
}

export interface Review {
  id: string;
  medicineId: string;
  orderId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number; // rating: count
  };
}

export const reviewService = {
  /**
   * Create a new review for a medicine
   */
  async createReview(data: ReviewData) {
    return api.post<{ success: boolean; data: Review }>("/reviews", data);
  },

  /**
   * Get reviews for a medicine
   */
  async getMedicineReviews(medicineId: string, params?: { page?: number; limit?: number }) {
    return api.get<{ success: boolean; data: { reviews: Review[]; pagination: any } }>(
      `/reviews/medicine/${medicineId}`,
      { params }
    );
  },

  /**
   * Get review statistics for a medicine
   */
  async getMedicineReviewStats(medicineId: string) {
    return api.get<{ success: boolean; data: ReviewStats }>(
      `/reviews/medicine/${medicineId}/stats`
    );
  },

  /**
   * Get user's reviews
   */
  async getUserReviews(params?: { page?: number; limit?: number }) {
    return api.get<{ success: boolean; data: { reviews: Review[]; pagination: any } }>(
      "/reviews/my-reviews",
      { params }
    );
  },

  /**
   * Update a review
   */
  async updateReview(reviewId: string, data: Partial<ReviewData>) {
    return api.put<{ success: boolean; data: Review }>(
      `/reviews/${reviewId}`,
      data
    );
  },

  /**
   * Delete a review
   */
  async deleteReview(reviewId: string) {
    return api.delete<{ success: boolean }>(`/reviews/${reviewId}`);
  },

  /**
   * Get reviews for a specific order
   */
  async getOrderReviews(orderId: string) {
    return api.get<{ success: boolean; data: Review[] }>(
      `/reviews/order/${orderId}`
    );
  },

  /**
   * Check if user has reviewed a medicine in an order
   */
  async hasReview(orderId: string, medicineId: string) {
    return api.get<{ success: boolean; data: boolean }>(
      `/reviews/check`,
      { params: { orderId, medicineId } }
    );
  },
};
