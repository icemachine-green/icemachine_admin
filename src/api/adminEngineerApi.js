import axiosInstance from "./axiosInstance.js";

const BASE_URL = "/api/admin/engineers";

export const adminEngineerApi = {
  // 기사 목록 조회 (페이지네이션, 필터 포함)
  getEngineers: async (params) => {
    return await axiosInstance.get(BASE_URL, { params });
  },

  // 상단 요약 통계 조회
  getSummary: async () => {
    return await axiosInstance.get(`${BASE_URL}/summary`);
  },

  // 기사 상태 변경 (활성/비활성)
  updateStatus: async (id, status) => {
    return await axiosInstance.patch(`${BASE_URL}/${id}/status`, { status });
  },

  // 기사 정보 수정 (등급 등)
  updateEngineer: async (id, data) => {
    return await axiosInstance.patch(`${BASE_URL}/${id}`, data);
  },
};
