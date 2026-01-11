import axiosInstance from "./axiosInstance.js";

const REASSIGN_URL = "/api/admin";

export const adminReassignApi = {
  /**
   * 1. 추천 기사 리스트 조회
   * 라우터 설정: GET /:id/recommend-engineers
   * 실제 주소: /api/admin/:id/recommend-engineers (이건 잘 된다고 하셨죠?)
   */
  getRecommendedEngineers: async (reservationId) => {
    return await axiosInstance.get(
      `${REASSIGN_URL}/${reservationId}/recommend-engineers`
    );
  },

  /**
   * 2. 기사 배정 확정 (404 해결 최종본)
   * 라우터 설정: router.patch("/reservations/:id/assign", ...)
   * 실제 주소: /api/admin/reservations/:id/assign
   */
  assignEngineer: async (reservationId, engineerId) => {
    // 🚩 라우터 경로에 맞춰 /reservations/ 를 명시적으로 추가
    const url = `${REASSIGN_URL}/reservations/${reservationId}/assign`;

    console.log(`📡 [API Call] PATCH ${url}`);
    console.log(`📦 [Body] engineerId:`, engineerId);

    return await axiosInstance.patch(url, { engineerId });
  },
};
