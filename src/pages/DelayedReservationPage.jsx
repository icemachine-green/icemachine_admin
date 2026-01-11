import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  fetchRecentReservations,
  fetchReservationDetail,
} from "../store/thunks/adminReservationThunk.js";
import LiveClock from "../common/LiveClock.jsx";
import ReservationDetailModal from "./ReservationDetailModal.jsx";
import "./DelayedReservationPage.css";

// 서비스 타입 한글 매핑 유틸
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

  // 리덕스 상태 가져오기
  const { recentReservations: reservations, loading } = useSelector(
    (state) => state.adminReservation
  );

  /**
   * API 데이터 로드 (1분 주기 폴링)
   */
  const loadData = useCallback(() => {
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

  useEffect(() => {
    loadData();
    const pollingTimer = setInterval(loadData, 60000);
    return () => clearInterval(pollingTimer);
  }, [loadData]);

  /**
   * 시계에서 매 초 전달받는 시간을 상태에 저장
   */
  const handleTick = useCallback((now) => {
    setCurrentNow(now);
  }, []);

  /**
   * 상세 모달 열기
   */
  const handleOpenDetail = (id) => {
    dispatch(fetchReservationDetail(id));
  };

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

  return (
    <div className="DelayedReservationPage-container">
      {/* 헤더 영역 */}
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

      {/* 테이블 영역 */}
      <section className="DelayedReservationPage-table-wrapper">
        <div className="DelayedReservationPage-table">
          {/* 컬럼 헤더 */}
          <div className="DelayedReservationPage-table-row DelayedReservationPage-table-head">
            <div>지연 상태</div>
            <div>예약 일시</div>
            <div>매장명 / 주소</div>
            <div>담당 기사</div>
            <div>고객 정보</div>
            <div>서비스 정보</div>
            <div>관리</div>
          </div>

          {/* 테이블 바디 */}
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
                      {/* 1. 지연 상태 */}
                      <div className="cell-delay">
                        <span
                          className="delay-badge"
                          style={{
                            color:
                              totalDelayMinutes >= 30 ? "#e74c3c" : "#f39c12",
                          }}
                        >
                          {totalDelayMinutes.toLocaleString()}분 지연
                        </span>
                      </div>

                      {/* 2. 예약 일시 */}
                      <div className="cell-composite">
                        <span className="cell-main">
                          {dayjs(row.serviceStartTime).format("HH:mm")}
                        </span>
                        <span className="cell-sub">{row.reservedDate}</span>
                      </div>

                      {/* 3. 매장명 / 주소 */}
                      <div className="cell-composite">
                        <span className="cell-main">
                          {row.business?.name || "-"}
                        </span>
                        <span className="cell-sub">
                          {row.business?.address}
                        </span>
                      </div>

                      {/* 4. 담당 기사 */}
                      <div className="cell-composite">
                        <span className="cell-main">
                          {row.engineer?.name || (
                            <span className="unassigned">미배정</span>
                          )}
                        </span>
                        <span className="cell-sub">
                          {row.engineer?.phoneNumber || "-"}
                        </span>
                      </div>

                      {/* 5. 고객 정보 */}
                      <div className="cell-composite">
                        <span className="cell-main">
                          {row.user?.name || "-"}
                        </span>
                        <span className="cell-sub">
                          {row.user?.phoneNumber || "-"}
                        </span>
                      </div>

                      {/* 6. 서비스 정보 */}
                      <div className="cell-composite">
                        <span className="cell-main">
                          {formatServiceType(row.servicePolicy?.serviceType)}
                        </span>
                        <span className="cell-sub">
                          {row.iceMachine?.modelName}
                        </span>
                      </div>

                      {/* 7. 관리 버튼 */}
                      <div className="cell-action">
                        <button
                          className="manage-btn"
                          onClick={() => handleOpenDetail(row.id)}
                        >
                          상세
                        </button>
                      </div>
                    </div>
                  );
                })
              : !loading && (
                  <div className="DelayedReservationPage-no-data">
                    지연된 내역이 없습니다.
                  </div>
                )}
          </div>
        </div>
      </section>

      {/* 상세 정보 모달 */}
      <ReservationDetailModal />
    </div>
  );
}
