import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { fetchRecentReservations } from "../store/thunks/adminReservationThunk.js";
import "./DelayedReservationPage.css";

const STATUS_MAP = {
  PENDING: {
    label: "접수됨",
    className: "DelayedReservationPage-status-pending",
  },
  CONFIRMED: {
    label: "확정됨",
    className: "DelayedReservationPage-status-confirmed",
  },
  START: { label: "작업중", className: "DelayedReservationPage-status-start" },
  COMPLETED: {
    label: "완료됨",
    className: "DelayedReservationPage-status-completed",
  },
  CANCELED: {
    label: "취소",
    className: "DelayedReservationPage-status-canceled",
  },
};

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
  const [now, setNow] = useState(dayjs());
  const [lastUpdated, setLastUpdated] = useState(dayjs());

  const { recentReservations: reservations, loading } = useSelector(
    (state) => state.adminReservation
  );

  useEffect(() => {
    const loadData = () => {
      dispatch(
        fetchRecentReservations({
          page: 1,
          limit: 200,
          orderBy: "serviceStartTime",
          sortBy: "ASC",
          status: "CONFIRMED",
        })
      );
      setLastUpdated(dayjs()); // 데이터 로드 시점에만 갱신 시간 업데이트
    };

    // 1. 최초 데이터 로딩
    loadData();

    // 2. 1분마다 API 폴링
    const pollingTimer = setInterval(loadData, 60000);

    // 3. 1초마다 현재 시간 업데이트 (실시간 지연시간 계산용)
    const timeUpdateTimer = setInterval(() => setNow(dayjs()), 1000);

    // 4. 컴포넌트 언마운트 시 타이머 정리
    return () => {
      clearInterval(pollingTimer);
      clearInterval(timeUpdateTimer);
    };
  }, [dispatch]);

  // 10분 유예 로직이 포함된 필터링
  const delayedList =
    reservations?.filter((row) => {
      if (row.status !== "CONFIRMED") return false;

      // 예약 시작 시간 + 10분 시점을 계산
      const gracePeriodThreshold = dayjs(row.serviceStartTime).add(
        10,
        "minute"
      );

      // 현재 시간이 유예 기간(10분)을 지났을 때만 목록에 노출
      return now.isAfter(gracePeriodThreshold);
    }) || [];

  return (
    <div className="DelayedReservationPage-container">
      <div className="DelayedReservationPage-header">
        <div className="DelayedReservationPage-title-area">
          <h1 className="DelayedReservationPage-title">
            🚨 작업 지연 의심 예약 관리
          </h1>
          <div className="DelayedReservationPage-sync-info">
            <span className="DelayedReservationPage-live-dot"></span>
                          <span>마지막 갱신: {lastUpdated.format("HH:mm:ss")} (작업시간 기준 10분 지연된 목록들을 불러옵니다.)</span>
            <span className="DelayedReservationPage-current-time">
              현재 시각: {now.format("HH:mm:ss")}
            </span>
          </div>
        </div>{" "}
        <button
          className="DelayedReservationPage-back-btn"
          onClick={() => navigate("/reservation")}
        >
          ← 전체 목록으로 돌아가기
        </button>
      </div>

      <div className="DelayedReservationPage-summary">
        현재 10분 이상 지연된 항목: <strong>{delayedList.length}</strong>건
      </div>

      <section className="DelayedReservationPage-table-wrapper">
        <div className="DelayedReservationPage-table">
          {/* Table Head */}
          <div className="DelayedReservationPage-table-row DelayedReservationPage-table-head">
            <div>ID</div>
            <div>예약 일시</div>
            <div>매장명</div>
            <div>제빙기</div>
            <div>서비스 타입</div>
            <div>고객 정보</div>
            <div>지연 시간</div>
          </div>

          {/* Table Body */}
          <div
            className={`DelayedReservationPage-table-body ${
              loading ? "DelayedReservationPage-is-loading" : ""
            }`}
          >
            {delayedList.length > 0
              ? delayedList.map((row) => {
                  const totalDelayMinutes = now.diff(
                    dayjs(row.serviceStartTime),
                    "minute"
                  );
                  return (
                    <div
                      key={row.id}
                      className="DelayedReservationPage-table-row"
                    >
                      {/* ID */}
                      <div className="cell-id">{row.id}</div>

                      {/* 예약 일시 */}
                      <div className="cell-composite">
                        <span className="cell-main">
                          {row.serviceStartTime?.split(" ")[1].substring(0, 5)}
                        </span>
                        <span className="cell-sub">{row.reservedDate}</span>
                      </div>

                      {/* 매장명 */}
                      <div>{row.business?.name || "-"}</div>

                      {/* 제빙기 */}
                      <div className="cell-composite">
                        <span className="cell-main">
                          {row.iceMachine?.modelName || "-"}
                        </span>
                        <span className="cell-sub">
                          {formatSizeType(row.iceMachine?.sizeType)}
                        </span>
                      </div>

                      {/* 서비스 타입 */}
                      <div>
                        {formatServiceType(row.servicePolicy?.serviceType)}
                      </div>

                      {/* 고객 정보 */}
                      <div className="cell-composite">
                        <span className="cell-main">
                          {row.user?.name || "-"}
                        </span>
                        <span className="cell-sub">
                          {row.user?.phoneNumber || "연락처 없음"}
                        </span>
                      </div>

                      {/* 지연 시간 */}
                      <div className="cell-delay">
                        <span className="delay-text">
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
