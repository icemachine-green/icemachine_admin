import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // 커스텀 sw.js를 사용할 때는 injectManifest 전략을 써야 합니다.
      strategies: "injectManifest",
      srcDir: "src", // sw.js 파일이 public 폴더에 있다고 가정
      filename: "sw.js",
      registerType: "autoUpdate",
      devOptions: {
        enabled: true, // 로컬에서도 PWA 테스트 가능
        type: "module",
      },
      manifest: {
        name: "관리자 페이지",
        short_name: "Admin",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  preview: {
    port: 5173,
  },
});
