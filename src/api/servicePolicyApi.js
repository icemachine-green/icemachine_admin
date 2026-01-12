import axiosInstance from "./axiosInstance.js";

export const servicePolicyApi = {
  /**
   * 전체 서비스 정책 조회
   * axiosInstance를 사용하여 Vite Proxy(/api)를 경유합니다.
   */
  getAllPolicies: async () => {
    // 주소를 직접 적지 않고 상대 경로만 적으면 프록시가 3000번 포트로 넘겨줍니다.
    return await axiosInstance.get("/api/service-policies");
  },
};
