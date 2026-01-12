import axiosInstance from "./axiosInstance.js";

const ADMIN_USER_URL = "/api/admin/users";

export const adminUserManageApi = {
  /**
   * 전체 고객 목록 조회 (검색/필터/페이징)
   * params: { userName, businessName, address, startDate, endDate, sort, page, limit }
   */
  getUsers: async (params) => {
    return await axiosInstance.get(`${ADMIN_USER_URL}`, { params });
  },

  /**
   * 특정 고객 상세 조회 (프로필/매장/기기/예약이력)
   */
  getUserDetail: async (id) => {
    return await axiosInstance.get(`${ADMIN_USER_URL}/${id}`);
  },
};
