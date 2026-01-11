import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export default function DelayAlertManager() {
  const navigate = useNavigate();

  // 🚩 1. 구독하는 주머니를 우리가 만든 'delayAlert'로 교체!
  const { delayData } = useSelector((state) => state.delayAlert);

  const [showNotification, setShowNotification] = useState(false);
  const [prevCount, setPrevCount] = useState(0);

  // 🔊 음성 알림 (TTS)
  const speakAlert = useCallback((count) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const message = new SpeechSynthesisUtterance(
        `태호님, 작업 지연 의심 사례가 ${count}건 발생했습니다. 확인이 필요합니다.`
      );
      message.lang = "ko-KR";
      window.speechSynthesis.speak(message);
    }
  }, []);

  useEffect(() => {
    // 🚩 2. 데이터가 없으면 계산 안 함
    if (!delayData || delayData.length === 0) {
      console.log("🔊 [Manager] 데이터가 비어있습니다.");
      return;
    }

    // 🚩 3. 10분 유예 로직 적용해서 '진짜 지연'만 필터링
    const now = dayjs();
    const currentDelayedItems = delayData.filter((res) => {
      if (res.status !== "CONFIRMED") return false;
      const startTime = dayjs(res.serviceStartTime || res.reservationTime);
      return now.isAfter(startTime.add(10, "minute")); // 10분 유예
    });

    const currentCount = currentDelayedItems.length;
    console.log(
      `🔊 [Manager] 현재 지연 건수: ${currentCount} (이전: ${prevCount})`
    );

    // 🚩 4. 개수가 늘어났을 때만 알림 발생
    if (currentCount > prevCount && currentCount > 0) {
      console.log("🚨 [Manager] 알림 조건 충족! 소리를 재생합니다.");
      setShowNotification(true);
      speakAlert(currentCount);
    }

    setPrevCount(currentCount);
  }, [delayData, prevCount, speakAlert]);

  if (!showNotification) return null;

  return (
    <div style={notificationBoxStyle}>
      <div
        style={{
          fontWeight: "bold",
          fontSize: "16px",
          marginBottom: "8px",
          color: "#ff4d4f",
        }}
      >
        🚨 지연 의심 알림
      </div>
      <p style={{ fontSize: "14px", margin: "0 0 15px 0" }}>
        현재 <b>{prevCount}건</b>의 작업이 10분 이상 지연되고 있습니다.
      </p>
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={() => {
            navigate("/reservation/delay");
            setShowNotification(false);
          }}
          style={actionBtnStyle}
        >
          확인하러 가기
        </button>
        <button
          onClick={() => setShowNotification(false)}
          style={closeBtnStyle}
        >
          닫기
        </button>
      </div>
    </div>
  );
}

// 스타일은 태호님이 주신 것 그대로 사용 (생략)
const notificationBoxStyle = {
  position: "fixed",
  bottom: "30px",
  right: "30px",
  width: "300px",
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  borderLeft: "6px solid #ff4d4f",
  zIndex: 10000,
};
const actionBtnStyle = {
  flex: 1,
  padding: "8px",
  background: "#ff4d4f",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
};
const closeBtnStyle = {
  flex: 1,
  padding: "8px",
  background: "#f0f0f0",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
