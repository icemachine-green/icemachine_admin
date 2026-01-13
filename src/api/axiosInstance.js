import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { reissueThunk } from "../store/thunks/authThunk.js";

let store = null;

export function injectStoreInAxios(_store) {
  store = _store;
}

// 토큰 재발급 중 중복 요청을 방지하기 위한 변수들
let isRefreshing = false;
let failedQueue = [];

// 대기 중인 요청들을 처리하는 함수
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const axiosInstance = axios.create({
  // 배포 시에는 VITE_API_URL을 사용.
  baseURL: import.meta.env.VITE_API_URL || "/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

//  개발 환경
// const axiosInstance = axios.create({
//   // 프록시를 사용하므로 도메인을 명시하지 않고 상대 경로를 기준점
//   baseURL: "/",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

axiosInstance.interceptors.request.use(
  async (config) => {
    // reissue 경로 자체는 가로채지 않음
    const isReissueRequest = config.url.includes("/api/admin/reissue");
    if (isReissueRequest) return config;

    let { accessToken } = store.getState().auth;

    // 토큰이 아예 없으면 그대로 진행 (로그인 등)
    if (!accessToken || accessToken === "undefined") return config;

    try {
      const claims = jwtDecode(accessToken);
      const now = dayjs().unix();
      // 만료 1분 전부터 갱신 시도
      const expTime = dayjs.unix(claims.exp).subtract(1, "minute").unix();

      if (now >= expTime) {
        // 이미 다른 요청이 토큰을 갱신 중이라면 대기열에 추가
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              config.headers["Authorization"] = `Bearer ${token}`;
              return config;
            })
            .catch((err) => Promise.reject(err));
        }

        // 갱신 시작
        isRefreshing = true;
        console.log("[Axios] Token 만료 예정 - 단일 reissue 호출 시작");

        try {
          const response = await store.dispatch(reissueThunk()).unwrap();
          const newAccessToken = response.accessToken;

          isRefreshing = false;
          processQueue(null, newAccessToken); // 대기 중인 요청들에 새 토큰 전달

          config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return config;
        } catch (refreshError) {
          isRefreshing = false;
          processQueue(refreshError, null); // 에러 발생 시 대기열 모두 실패 처리
          return Promise.reject(refreshError);
        }
      }

      // 만료되지 않았다면 기존 토큰 부착
      config.headers["Authorization"] = `Bearer ${accessToken}`;
      return config;
    } catch (error) {
      console.error("[Axios Interceptor] 토큰 처리 중 오류 발생:", error);
      delete config.headers["Authorization"];
      return config;
    }
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
