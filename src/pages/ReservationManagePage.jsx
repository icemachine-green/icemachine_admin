import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { fetchRecentReservations } from "../store/thunks/adminReservationThunk.js";
import "./ReservationManagePage.css";

const STATUS_MAP = {
  PENDING: { label: "대기", className: "status-pending" },
  CONFIRMED: { label: "확정", className: "status-confirmed" },
  START: { label: "작업 중", className: "status-start" },
  COMPLETED: { label: "완료", className: "status-completed" },
  CANCELED: { label: "취소", className: "status-canceled" },
};

const SERVICE_MAP = {
  VISIT_CHECK: "방문",
  STANDARD_CLEAN: "스탠다드",
  DEEP_CLEAN: "딥클린",
  PREMIUM_CLEAN: "프리미엄",
};

const formatSize = (size) => {
  if (!size || size === "모름" || size === "기타") return "기타/모름";
  if (size.includes("LARGE") || size.includes("대형")) return "대형";
  if (size.includes("MEDIUM") || size.includes("중형")) return "중형";
  if (size.includes("SMALL") || size.includes("소형")) return "소형";
  return size;
};

export default function ReservationManagePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [now, setNow] = useState(dayjs());
  const [lastUpdated, setLastUpdated] = useState(dayjs());

  const limit = 10;
  const reservationId = searchParams.get("reservationId") || "";
  const selectedDate = searchParams.get("date") || "";

  const {
    recentReservations: reservations,
    totalCount,
    loading,
  } = useSelector((state) => state.adminReservation);

  useEffect(() => {
    const loadData = () => {
      dispatch(
        fetchRecentReservations({
          page: currentPage,
          limit,
          reservationId,
          reservedDate: selectedDate,
        })
      );
      setLastUpdated(dayjs());
    };
    loadData();
    const pollingTimer = setInterval(loadData, 60000);
    const clockTimer = setInterval(() => setNow(dayjs()), 1000);
    return () => {
      clearInterval(pollingTimer);
      clearInterval(clockTimer);
    };
  }, [dispatch, currentPage, reservationId, selectedDate]);

  return (
    <div className="reservation-manage-container">
      <div className="reservation-manage-header-flex">
        <div className="title-area">
          <h1 className="reservation-manage-greeting">전체 예약 관리</h1>
          <div className="manage-sync-info">
            <span className="live-dot"></span>
            마지막 갱신: {lastUpdated.format("HH:mm:ss")} |
            <span className="current-time">
              {" "}
              현재 시각: {now.format("HH:mm:ss")}
            </span>
          </div>
        </div>
        <button
          className="delay-monitor-btn"
          onClick={() => navigate("/reservation/delay")}
        >
          🚨 작업 지연 감시 센터
        </button>
      </div>

      <section className="reservation-manage-table-wrapper">
        <div className="table-header">
          <h2>
            예약 목록 <span>(총 {totalCount || 0}건)</span>
          </h2>
        </div>

        <div className="reservation-manage-table">
          {/* 테이블 헤더 */}
          <div className="manage-table-row table-head">
            <div className="col-id">ID</div>
            <div className="col-user">고객 정보</div>
            <div className="col-business">매장명</div>
            <div className="col-machine">제빙기 모델/사이즈</div>
            <div className="col-engineer">담당 기사</div>
            <div className="col-service">서비스</div>
            <div className="col-date">예약일(시간)</div>
            <div className="col-status">상태</div>
          </div>

          {/* 테이블 바디 */}
          <div className={`manage-table-body ${loading ? "is-loading" : ""}`}>
            {reservations?.length > 0 ? (
              reservations.map((row) => (
                <div key={row.id} className="manage-table-row">
                  <div className="col-id">{row.id}</div>

                  <div className="col-user info-cell">
                    <strong>{row.user?.name || "-"}</strong>
                    <span className="sub-info">
                      {row.user?.phoneNumber || "-"}
                    </span>
                  </div>

                  <div className="col-business" title={row.business?.name}>
                    {row.business?.name || "-"}
                  </div>

                  <div className="col-machine info-cell">
                    <strong>{row.iceMachine?.modelName || "-"}</strong>
                    <span className="sub-info">
                      {formatSize(row.iceMachine?.sizeType)}
                    </span>
                  </div>

                  <div className="col-engineer info-cell">
                    {row.engineer ? (
                      <>
                        <strong>{row.engineer.name}</strong>
                        <span className="sub-info">
                          {row.engineer.phoneNumber}
                        </span>
                      </>
                    ) : (
                      <span className="unassigned-text">미배정</span>
                    )}
                  </div>

                  <div className="col-service">
                    <span className="service-text">
                      {SERVICE_MAP[row.servicePolicy?.serviceType] || "기타"}
                    </span>
                  </div>

                  <div className="col-date info-cell">
                    <strong>{row.reservedDate}</strong>
                    <span className="sub-info">
                      {row.serviceStartTime
                        ? dayjs(row.serviceStartTime).format("HH:mm")
                        : "00:00"}{" "}
                      ~
                      {row.serviceEndTime
                        ? dayjs(row.serviceEndTime).format("HH:mm")
                        : "00:00"}
                    </span>
                  </div>

                  <div className="col-status">
                    <span
                      className={`status-badge ${
                        STATUS_MAP[row.status]?.className || ""
                      }`}
                    >
                      {STATUS_MAP[row.status]?.label || row.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data-msg">
                {loading ? "데이터 로딩 중..." : "예약 내역이 없습니다."}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
