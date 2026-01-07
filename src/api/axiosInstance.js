import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { reissueThunk } from "../store/thunks/authThunk.js";

let store = null;

export function injectStoreInAxios(_store) {
  store = _store;
}

const axiosInstance = axios.create({
  // 프록시를 사용하므로 도메인을 명시하지 않고 상대 경로를 기준점으로 잡습니다.
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    // 관리자 전용 reissue 경로 체크
    const isReissueRequest = config.url.includes("/api/admin/reissue");
    if (isReissueRequest) return config;

    let { accessToken } = store.getState().auth;

    if (!accessToken || accessToken === "undefined") return config;

    try {
      const claims = jwtDecode(accessToken);
      const now = dayjs().unix();

      // 만료 1분 전 자동 갱신
      const expTime = dayjs.unix(claims.exp).subtract(1, "minute").unix();

      if (now >= expTime) {
        console.log("[Axios] Token 만료 예정 - 자동 갱신 시도");
        const response = await store.dispatch(reissueThunk()).unwrap();
        accessToken = response.accessToken;
      }

      config.headers["Authorization"] = `Bearer ${accessToken}`;
      return config;
    } catch (error) {
      console.error("[Axios Interceptor] 토큰 처리 중 오류 발생:", error);
      // 만약 토큰이 손상되었다면 잘못된 토큰을 보내는 대신 헤더를 삭제하고 보냄
      delete config.headers["Authorization"];
      return config;
    }
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
