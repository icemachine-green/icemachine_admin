import { precacheAndRoute } from "workbox-precaching";

// 1. 소스 코드(JS, CSS, HTML)만 사전 캐싱 (앱 실행 속도용)
// API 데이터는 절대 캐싱하지 않음!
precacheAndRoute(self.__WB_MANIFEST);

// --- 푸시 알림 수신 로직 (이건 유지해야 함) ---

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

// 알림 클릭 시 해당 페이지로 포커스 이동
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) return self.clients.openWindow("/");
      })
  );
});
