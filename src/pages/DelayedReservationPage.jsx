import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { fetchRecentReservations } from "../store/thunks/adminReservationThunk.js";
import LiveClock from "../common/LiveClock.jsx"; // 🚩 상대경로 적용
import "./DelayedReservationPage.css";

// 포맷팅 유틸 함수
const formatSizeType = (sizeType) => {
  if (!sizeType) return "-";
  const upper = sizeType.toUpperCase();
  if (upper.includes("SMALL") || upper.includes("소형")) return "소형";
  if (upper.includes("MEDIUM") || upper.includes("중형")) return "중형";
  if (upper.includes("LARGE") || upper.includes("대형")) return "대형";
  return sizeType;
};

const formatServiceType = (serviceType) => {
  const typeMap = {
    VISIT_CHECK: "점검",
    STANDARD_CLEAN: "일반",
    DEEP_CLEAN: "분해",
    PREMIUM_CLEAN: "특수",
  };
  return typeMap[serviceType] || serviceType || "-";
};

export default function DelayedReservationPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 상태 관리
  const [currentNow, setCurrentNow] = useState(dayjs());
  const [lastUpdated, setLastUpdated] = useState(dayjs());

  const { recentReservations: reservations, loading } = useSelector(
    (state) => state.adminReservation
  );

  /**
   * API 데이터 로드 함수
   * useCallback으로 감싸서 리렌더링 시 함수가 재생성되는 것을 방지합니다.
   */
  const loadData = useCallback(() => {
    console.log(
      "📡 [지연 감시 센터] 데이터를 새로고침합니다:",
      dayjs().format("HH:mm:ss")
    );
    dispatch(
      fetchRecentReservations({
        page: 1,
        limit: 200,
        orderBy: "serviceStartTime",
        sortBy: "ASC",
        status: "CONFIRMED",
      })
    );
    setLastUpdated(dayjs());
  }, [dispatch]);

  /**
   * 최초 로드 및 1분 폴링 설정
   * loadData가 메모이제이션되어 있어 타이머가 중복 생성되지 않습니다.
   */
  useEffect(() => {
    loadData();
    const pollingTimer = setInterval(loadData, 60000); // 1분
    return () => clearInterval(pollingTimer);
  }, [loadData]);

  /**
   * 시계에서 매 초 전달받는 시간을 상태에 저장
   * (지연 시간 실시간 계산용)
   */
  const handleTick = useCallback((now) => {
    setCurrentNow(now);
  }, []);

  /**
   * 10분 유예 로직 필터링
   */
  const delayedList =
    reservations?.filter((row) => {
      if (row.status !== "CONFIRMED") return false;
      const gracePeriodThreshold = dayjs(row.serviceStartTime).add(
        10,
        "minute"
      );
      return currentNow.isAfter(gracePeriodThreshold);
    }) || [];
  console.log("시계 분리 확인");
  return (
    <div className="DelayedReservationPage-container">
      <div className="DelayedReservationPage-header">
        <div className="DelayedReservationPage-title-area">
          <h1 className="DelayedReservationPage-title">
            🚨 작업 지연 의심 예약 관리
          </h1>
          <div className="DelayedReservationPage-sync-info">
            <span className="DelayedReservationPage-live-dot"></span>
            <span>마지막 갱신: {lastUpdated.format("HH:mm:ss")}</span>
            <span className="DelayedReservationPage-current-time">
              현재 시각: <LiveClock onTick={handleTick} />
            </span>
          </div>
        </div>
        <button
          className="DelayedReservationPage-back-btn"
          onClick={() => navigate("/reservation")}
        >
          ← 전체 목록으로 돌아가기
        </button>
      </div>

      <div className="DelayedReservationPage-summary">
        현재 지연 의심 항목: <strong>{delayedList.length}</strong>건
      </div>

      <section className="DelayedReservationPage-table-wrapper">
        <div className="DelayedReservationPage-table">
          {/* Table Head */}
          <div className="DelayedReservationPage-table-row DelayedReservationPage-table-head">
            <div>ID</div>
            <div>예약 일시</div>
            <div>매장명 / 주소</div>
            <div>서비스 정보</div>
            <div>고객 정보</div>
            <div>담당 기사</div>
            <div>지연 시간</div>
          </div>

          {/* Table Body */}
          <div
            className={`DelayedReservationPage-table-body ${
              loading ? "is-loading" : ""
            }`}
          >
            {delayedList.length > 0
              ? delayedList.map((row) => {
                  const totalDelayMinutes = currentNow.diff(
                    dayjs(row.serviceStartTime),
                    "minute"
                  );
                  return (
                    <div
                      key={row.id}
                      className="DelayedReservationPage-table-row"
                    >
                      <div className="cell-id">{row.id}</div>

                      <div className="cell-composite">
                        <span className="cell-main">
                          {dayjs(row.serviceStartTime).format("HH:mm")}
                        </span>
                        <span className="cell-sub">{row.reservedDate}</span>
                      </div>

                      <div className="cell-composite">
                        <span className="cell-main">
                          {row.business?.name || "-"}
                        </span>
                        <span
                          className="cell-sub"
                          style={{ fontSize: "0.75rem", color: "#888" }}
                        >
                          {row.business?.address || "주소 정보 없음"}
                        </span>
                      </div>

                      <div className="cell-composite">
                        <span className="cell-main">
                          {formatServiceType(row.servicePolicy?.serviceType)}
                        </span>
                        <span className="cell-sub">
                          {row.iceMachine?.modelName || "-"}
                        </span>
                      </div>

                      <div className="cell-composite">
                        <span className="cell-main">
                          {row.user?.name || "-"}
                        </span>
                        <span className="cell-sub">
                          {row.user?.phoneNumber || "-"}
                        </span>
                      </div>

                      <div>
                        {row.engineer?.name || (
                          <span style={{ color: "#e74c3c" }}>미배정</span>
                        )}
                      </div>

                      <div className="cell-delay">
                        <span
                          className="delay-text"
                          style={{
                            color:
                              totalDelayMinutes >= 30 ? "#e74c3c" : "inherit",
                            fontWeight: "bold",
                          }}
                        >
                          {totalDelayMinutes.toLocaleString()}분 지연
                        </span>
                      </div>
                    </div>
                  );
                })
              : !loading && (
                  <div className="DelayedReservationPage-no-data">
                    현재 지연된 예약 내역이 없습니다.
                  </div>
                )}
          </div>
        </div>
      </section>
    </div>
  );
}
