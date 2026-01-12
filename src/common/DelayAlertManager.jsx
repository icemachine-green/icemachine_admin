import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function DelayAlertManager({ isMuted }) {
  const { delayedItems } = useSelector((state) => state.delayAlert);
  const count = delayedItems?.length || 0;

  const speakNotification = (text) => {
    if (!window.speechSynthesis || isMuted) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (count > 0) {
      const message =
        "지연 작업이 감지되었습니다. 지연 작업 관리를 확인해 주세요.";

      document.body.classList.add("visual-alert-active");

      if (!isMuted) {
        speakNotification(message);

        if (Notification.permission === "granted") {
          new Notification("작업 지연 발생", {
            body: message,
            tag: "delay-alert",
            renotify: true,
          });
        }
      }

      document.title = `[${count}건] 지연 발생!`;
    } else {
      document.body.classList.remove("visual-alert-active");
      document.title = "관리 시스템";
    }
  }, [delayedItems, isMuted, count]);

  return null;
}
