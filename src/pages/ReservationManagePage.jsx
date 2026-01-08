import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { fetchRecentReservations } from "../store/thunks/adminReservationThunk.js";
import "./ReservationManagePage.css";

const STATUS_MAP = {
  PENDING: { label: "접수됨", className: "접수됨" },
  CONFIRMED: { label: "확정됨", className: "확정됨" },
  START: { label: "작업중", className: "작업중" },
  COMPLETED: { label: "완료됨", className: "완료됨" },
  CANCELED: { label: "취소", className: "취소" },
};

export default function ReservationManagePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [now, setNow] = useState(dayjs());
  const [lastUpdated, setLastUpdated] = useState(dayjs());

  const limit = 8;
  const pageGroupSize = 5;
  const reservationId = searchParams.get("reservationId");

  const {
    recentReservations: reservations,
    totalCount,
    loading,
  } = useSelector((state) => state.adminReservation);

  useEffect(() => {
    const loadData = () => {
      dispatch(
        fetchRecentReservations({
          page: reservationId ? 1 : currentPage,
          limit,
          orderBy: "serviceStartTime",
          sortBy: "ASC",
          reservationId: reservationId || "",
        })
      );
      setLastUpdated(dayjs()); // 데이터 로드 완료 시점 기록
    };

    // 1. 첫 로딩
    loadData();

    // 2. 1분마다 API 호출 (폴링)
    const pollingTimer = setInterval(loadData, 60000);

    // 3. 1초마다 시계 업데이트
    const clockTimer = setInterval(() => setNow(dayjs()), 1000);

    return () => {
      clearInterval(pollingTimer);
      clearInterval(clockTimer);
    };
  }, [dispatch, currentPage, reservationId]);

  const totalPages = Math.ceil((totalCount || 0) / limit) || 1;
  const currentGroup = Math.ceil(currentPage / pageGroupSize);
  const startPage = (currentGroup - 1) * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleClearSearch = () => {
    setCurrentPage(1);
    navigate("/reservation", { replace: true });
  };

  return (
    <div className="reservation-manage-container">
      <div className="reservation-manage-header-flex">
        <div>
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
          <div className="header-title-area">
            {reservationId ? (
              <div className="search-info-badge">
                <span className="search-icon">🔍</span>
                예약 번호 <strong>[{reservationId}]</strong> 검색 결과
                <button
                  className="clear-search-btn"
                  onClick={handleClearSearch}
                >
                  전체 보기
                </button>
              </div>
            ) : (
              <h2>
                예약 목록{" "}
                <span>
                  (페이지: {currentPage} / {totalPages})
                </span>
              </h2>
            )}
          </div>
          <div className="header-stats">
            총 <strong>{totalCount || 0}</strong> 건
          </div>
        </div>

        <div className="reservation-manage-table">
          <div className="manage-table-row table-head">
            <div>예약 ID</div>
            <div>고객명</div>
            <div>업체명</div>
            <div>기사명</div>
            <div>예약 날짜</div>
            <div>서비스 시간</div>
            <div>상태</div>
          </div>
          <div className={`manage-table-body ${loading ? "is-loading" : ""}`}>
            {reservations?.length > 0
              ? reservations.map((row) => (
                  <div
                    key={row.id}
                    className={`manage-table-row ${
                      Number(reservationId) === row.id ? "highlighted-row" : ""
                    }`}
                  >
                    <div className="id-cell">{row.id}</div>
                    <div>{row.user?.name || "-"}</div>
                    <div>{row.business?.name || "-"}</div>
                    <div className={!row.engineer ? "unassigned" : ""}>
                      {row.engineer?.name || "미배정"}
                    </div>
                    <div>{row.reservedDate}</div>
                    <div>
                      {row.serviceStartTime?.split(" ")[1].substring(0, 5)}~
                      {row.serviceEndTime?.split(" ")[1].substring(0, 5)}
                    </div>
                    <div>
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
              : !loading && (
                  <div className="manage-table-row no-data">
                    내역이 없습니다.
                  </div>
                )}
          </div>
        </div>

        {!reservationId && totalPages > 1 && (
          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {Array.from(
              { length: endPage - startPage + 1 },
              (_, i) => startPage + i
            ).map((num) => (
              <button
                key={num}
                className={`page-btn ${currentPage === num ? "active" : ""}`}
                onClick={() => handlePageChange(num)}
              >
                {num}
              </button>
            ))}
            <button
              className="page-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
