import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst, CacheFirst } from "workbox-strategies";

// 빌드 시 정적 자산 자동 주입
precacheAndRoute(self.__WB_MANIFEST);

const PREFIX = "icemachine-admin";

// 관리자 API는 항상 네트워크 우선 전략 (데이터 신선도 유지)
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/admin"),
  new NetworkFirst({ cacheName: `${PREFIX}-admin-api-cache` })
);

// 푸시 알림 수신 이벤트
self.addEventListener("push", (e) => {
  if (!e.data) return;
  const data = e.data.json();

  const options = {
    body: data.message,
    icon: "/icons/192_logo.png",
    badge: "/icons/192_logo.png",
    vibrate: [200, 100, 200],
    data: { targetUrl: data.data?.targetUrl || null },
  };

  e.waitUntil(self.registration.showNotification(data.title, options));
});

// 알림 클릭 이벤트 (리다이렉트 제거 버전)
self.addEventListener("notificationclick", (e) => {
  e.notification.close();

  e.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // 열려 있는 관리자 탭이 있다면 포커스
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            return client.focus();
          }
        }
        // 탭이 없으면 메인으로 열기
        if (self.clients.openWindow) return self.clients.openWindow("/");
      })
  );
});
