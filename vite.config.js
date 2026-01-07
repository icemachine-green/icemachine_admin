import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // Request 대상 서버 주소
        changeOrigin: true, // Request Header Host 필드 값을 대상 서버 호스트로 변경
        secure: false, // SSL 인증서 검증 무시
        ws: true, // WebSoket 프로토콜 사용
      },
    },
  },
});
