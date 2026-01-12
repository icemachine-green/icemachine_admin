import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

/**
 * 관리자 시스템용 Vite 설정 파일
 * PWA(Progressive Web App) 및 API 프록시 설정을 포함함
 */
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // 서비스 워커 업데이트 방식: 'autoUpdate'는 새 버전 배포 시 브라우저가 알아서 갱신하게 함
      registerType: "autoUpdate",

      // 전략 설정: 'injectManifest'는 우리가 직접 만든 src/sw.js 파일을 기반으로 빌드하겠다는 뜻
      // 커스텀 푸시 알림 로직을 넣으려면 이 방식이 필수임
      strategies: "injectManifest",

      // 소스 디렉토리와 파일명: 실제 작성한 sw.js가 어디 있는지 알려줌
      srcDir: "src",
      filename: "sw.js",

      // 서비스 워커 등록 코드 자동 주입: index.html에 sw 등록 스크립트를 Vite가 알아서 넣어줌
      injectRegister: "auto",

      // 캐싱 대상 자산: 빌드 시 포함할 아이콘 및 파비콘 파일들 (public 폴더 기준)
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "icons/*.png"],

      // 매니페스트 설정: '앱으로 설치' 시 나타나는 정보들
      manifest: {
        name: "icemachine_admin", // 앱 전체 이름
        short_name: "icemachine_admin", // 홈 화면 아이콘 아래 표시될 이름
        description: "Administrative Management System with Push Notifications",
        theme_color: "#ffffff", // 앱 상단 툴바 색상
        background_color: "#ffffff", // 앱 실행 시 잠깐 뜨는 배경색
        display: "standalone", // 주소창 없는 앱 형태 모드
        start_url: "/", // 시작 경로
        icons: [
          {
            src: "/icons/192_logo.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any", // 일반 아이콘
          },
          {
            src: "/icons/512_logo.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable", // 안드로이드 등에서 모양이 변하는 아이콘 대응
          },
        ],
      },

      // 빌드 시 서비스 워커에 주입될 설정
      injectManifest: {
        // 어떤 확장자 파일들을 캐싱해서 오프라인에서 쓸 건지 지정
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },

      // 개발 서버 테스트용 설정
      devOptions: {
        enabled: true, // npm run dev 환경에서도 PWA가 동작하게 함
        type: "module", // sw.js에서 import 구문을 쓰기 위해 필요함
      },
    }),
  ],

  // 빌드 관련 상세 설정 (네가 궁금해한 경로 등)
  build: {
    outDir: "dist", // 빌드 결과물이 저장될 폴더명 (기본값 dist)
    assetsDir: "assets", // JS, CSS 파일들이 모일 하위 폴더명
    sourcemap: false, // 배포 시 소스맵 제외 (보안 및 용량 최적화)
  },

  server: {
    proxy: {
      // 프론트에서 /api로 시작하는 요청은 전부 백엔드 서버로 토스 (CORS 해결)
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
