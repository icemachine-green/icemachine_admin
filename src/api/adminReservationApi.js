import axiosInstance from "./axiosInstance.js";

const ADMIN_RESERVATION_URL = "/api/admin";

export const adminReservationApi = {
  getDashboardStats: (params) => {
    return axiosInstance.get("/api/admin/dashboard/stats", { params });
  },

  getReservations: async (params) => {
    return await axiosInstance.get(`${ADMIN_RESERVATION_URL}/reservations`, {
      params,
    });
  },

  getReservationDetail: async (id) => {
    return await axiosInstance.get(
      `${ADMIN_RESERVATION_URL}/reservations/${id}`
    );
  },

  updateReservationStatus: async (id, status) => {
    return await axiosInstance.patch(
      `${ADMIN_RESERVATION_URL}/reservations/${id}/status`,
      { status }
    );
  },
};
