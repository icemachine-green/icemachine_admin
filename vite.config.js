import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa"; // PWA 플러그인 추가

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // 프론트에서 /api로 시작하는 요청은 전부 백엔드 서버로 토스 (CORS 해결)
      "/api": {
        target: "http://localhost:3000", // Request 대상 서버 주소
        changeOrigin: true, // Request Header Host 필드 값을 대상 서버 호스트로 변경
        secure: false, // SSL 인증서 검증 무시
        ws: true, // WebSoket 프로토콜 사용
      },
    },
  },
  preview: {
    port: 5173, // 원하는 포트로 변경
  },
});
