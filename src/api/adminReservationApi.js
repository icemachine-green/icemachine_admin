import axiosInstance from "./axiosInstance.js";

const ADMIN_RESERVATION_URL = "/api/admin";

export const adminReservationApi = {
  // 대시보드 통계 조회 (params 객체를 통째로 받도록 수정)
  getDashboardStats: (params) => {
    return axiosInstance.get("/api/admin/dashboard/stats", {
      params, // 이제 { mode: "today", startDate: "2024-..." } 가 전달됨
    });
  },

  // 예약 목록 조회
  getReservations: async (params) => {
    return await axiosInstance.get(`${ADMIN_RESERVATION_URL}/reservations`, {
      params,
    });
  },

  // 예약 상세 조회
  getReservationDetail: async (id) => {
    return await axiosInstance.get(
      `${ADMIN_RESERVATION_URL}/reservations/${id}`
    );
  },

  // 상태 업데이트
  updateReservationStatus: async (id, status) => {
    return await axiosInstance.patch(
      `${ADMIN_RESERVATION_URL}/reservations/${id}/status`,
      { status }
    );
  },
};
