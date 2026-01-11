import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function DelayAlertManager() {
  // 리덕스에서 전체 상태를 가져와서 데이터가 갱신될 때마다 반응하게 함
  const delayAlertState = useSelector((state) => state.delayAlert);
  const { delayedItems } = delayAlertState;
  const count = delayedItems?.length || 0;

  const speakNotification = (text) => {
    if (!window.speechSynthesis) return;
    // 중요: 소리가 씹히지 않도록 기존 음성을 즉시 강제 종료
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    console.log("🧐 현재 지연 건수 체크:", count);

    if (count > 0) {
      const message =
        "지연 작업이 감지되었습니다. 지연 작업 관리를 확인해 주세요.";

      // 시각 효과 활성화
      document.body.classList.add("visual-alert-active");

      // 음성 및 알림 실행
      speakNotification(message);

      if (Notification.permission === "granted") {
        new Notification("🚨 작업 지연 발생", {
          body: message,
          tag: "delay-alert",
          renotify: true,
        });
      }

      document.title = `⚠️ [${count}건] 지연 발생!`;
    } else {
      // 0건이면 모든 효과 제거
      document.body.classList.remove("visual-alert-active");
      document.title = "관리 시스템";
    }

    // 이 useEffect는 delayedItems가 "새로 들어올 때마다" 실행됩니다.
  }, [delayAlertState]); // 🚩 배열 전체 상태를 감시하여 리렌더링 시 무조건 실행 유도

  return null;
}
