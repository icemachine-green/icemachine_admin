import axiosInstance from "./axiosInstance.js";

const BASE_URL = "/api/admin/engineers";

export const adminEngineerApi = {
  /**
   * 기사 목록 조회 + 상단 요약 통계 통합 조회
   * 백엔드 서비스에서 findAllEngineers와 getEngineerSummaryStats 결과를 합쳐서 반환함
   * @param {Object} params - { page, limit, status, search, licenseLevel 등 }
   * @returns {Promise} - { items, total, summary: { totalEngineers, activeEngineers, ... } }
   */
  getEngineers: async (params) => {
    return await axiosInstance.get(BASE_URL, { params });
  },

  // 기사 상태 변경 (활성/비활성/퇴사 처리)
  updateStatus: async (id, status) => {
    // 백엔드 라우터: router.patch("/:id/status", ...)
    return await axiosInstance.patch(`${BASE_URL}/${id}/status`, { status });
  },

  // 기사 상세 정보 수정 (기술 등급 등)
  updateEngineer: async (id, data) => {
    // 백엔드 라우터: router.patch("/:id", ...)
    return await axiosInstance.patch(`${BASE_URL}/${id}`, data);
  },
};
