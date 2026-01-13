import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance.js";

export default function useAdminPush() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    async function checkSubscription() {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) setIsSubscribed(true);
      } catch (error) {
        console.error("[Push Service] 서비스 워커 연동 실패:", error);
      } finally {
        setIsReady(true);
      }
    }
    checkSubscription();
  }, []);

  const subscribeAdmin = async () => {
    try {
      if (isSubscribed) return;

      const registration = await navigator.serviceWorker.ready;
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        alert(
          "알림 권한이 거부되었습니다. 브라우저 설정에서 알림을 허용해 주세요."
        );
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
      });

      await axiosInstance.post("/api/admin/subscriptions", {
        subscription,
        deviceInfo: {
          userAgent: navigator.userAgent,
          language: navigator.language,
        },
      });

      setIsSubscribed(true);
      alert("실시간 업무 알림 수신 설정이 완료되었습니다.");
    } catch (error) {
      console.error("[Push Service] 구독 오류:", error);
    } finally {
      setHasChecked(true);
    }
  };

  return { isReady, isSubscribed, hasChecked, subscribeAdmin };
}
