import React, { useEffect, useState, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
// 🚩 임포트 경로 수정 완료
import {
  fetchDashboardStats,
  fetchRecentReservations,
  fetchReservationDetail,
} from "../store/thunks/adminReservationThunk.js";
import { setDashboardFilter } from "../store/slices/adminReservationSlice.js";

import ReservationDetailModal from "./ReservationDetailModal.jsx";
import "./DashboardPage.css";

const STATUS_MAP = {
  PENDING: { label: "접수됨", color: "blue" },
  CONFIRMED: { label: "확정됨", color: "purple" },
  START: { label: "작업중", color: "green" },
  COMPLETED: { label: "완료됨", color: "orange" },
  CANCELED: { label: "취소", color: "red" },
};

const LiveClock = memo(() => {
  const [now, setNow] = useState(dayjs());
  useEffect(() => {
    const clockTimer = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(clockTimer);
  }, []);
  return <>{now.format("HH:mm:ss")}</>;
});

export default function DashboardPage() {
  const dispatch = useDispatch();

  const {
    stats,
    recentReservations,
    loading,
    totalCount,
    statMode,
    currentPage,
  } = useSelector((state) => state.adminReservation);

  const [lastUpdated, setLastUpdated] = useState(dayjs());
  const limit = 5;
  const pageGroupSize = 5;

  const loadDashboardData = useCallback(async () => {
    const todayStr = dayjs().format("YYYY-MM-DD");

    const commonParams = {
      mode: statMode,
      startDate: todayStr,
      page: currentPage,
      limit: limit,
      orderBy: "reservedDate",
      sortBy: "ASC",
    };

    try {
      await Promise.all([
        dispatch(fetchDashboardStats(commonParams)),
        dispatch(fetchRecentReservations(commonParams)),
      ]);
      setLastUpdated(dayjs());
    } catch (err) {
      console.error("❌ [데이터 로드 에러]:", err);
    }
  }, [dispatch, statMode, currentPage, limit]);

  useEffect(() => {
    loadDashboardData();
    const pollingTimer = setInterval(loadDashboardData, 60000);
    return () => clearInterval(pollingTimer);
  }, [loadDashboardData]);

  const handleToggleMode = (mode) => {
    dispatch(setDashboardFilter({ mode, page: 1 }));
  };

  const handlePageChange = (pageNumber) => {
    dispatch(setDashboardFilter({ page: pageNumber }));
  };

  const totalPages = Math.ceil((totalCount || 0) / limit) || 1;
  const currentGroup = Math.ceil(currentPage / pageGroupSize);
  const startPage = (currentGroup - 1) * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  const handleOpenDetail = (id) => {
    dispatch(fetchReservationDetail(id));
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-flex">
        <div className="header-left">
          <h1 className="dashboard-greeting">
            안녕하세요, 관리자님! 대시보드입니다.
          </h1>
          <div className="dashboard-sync-info">
            <span className="live-dot"></span>
            데이터 갱신: {lastUpdated.format("HH:mm:ss")} |
            <span className="current-time">
              {" "}
              현재 시각: <LiveClock />
            </span>
          </div>
        </div>

        <div className="stats-toggle-area">
          <span className="toggle-label">기간 별 조회 :</span>
          <div className="toggle-group">
            {["today", "weekly", "monthly", "future"].map((m) => (
              <button
                key={m}
                className={`toggle-btn ${statMode === m ? "active" : ""}`}
                onClick={() => handleToggleMode(m)}
              >
                {m === "today" && "오늘"}
                {m === "weekly" && "~ 7일"}
                {m === "monthly" && "~ 30일"}
                {m === "future" && "~ 전체"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="dashboard-stats">
        {Object.keys(STATUS_MAP).map((key) => (
          <div key={key} className="stat-card">
            <strong className={STATUS_MAP[key].color}>
              {(stats[key] || 0).toLocaleString()}
            </strong>
            <span className={STATUS_MAP[key].color}>
              {STATUS_MAP[key].label}
            </span>
          </div>
        ))}
      </section>

      <section className="dashboard-table-wrapper">
        <div className="table-header">
          <h2>
            최신순{" "}
            <span>
              ({statMode.toUpperCase()} | {currentPage} / {totalPages} Page)
            </span>
          </h2>
          <span>
            총 내역 : <strong>{totalCount || 0}</strong> 건
          </span>
        </div>

        <div className="dashboard-table">
          <div className="table-row table-head">
            <div>예약 ID</div>
            <div>고객명</div>
            <div>업체명</div>
            <div>기사명</div>
            <div>예약 날짜</div>
            <div>관리</div>
            <div>상태</div>
          </div>

          <div
            className={`dashboard-table-body ${loading ? "is-loading" : ""}`}
          >
            {recentReservations?.length > 0 ? (
              recentReservations.map((row) => (
                <div key={row.id} className="table-row">
                  <div>{row.id}</div>
                  <div>{row.user?.name || "-"}</div>
                  <div>{row.business?.name || "-"}</div>
                  <div className={!row.engineer ? "unassigned" : ""}>
                    {row.engineer?.name || "미배정"}
                  </div>
                  <div>{row.reservedDate}</div>
                  <div>
                    <button
                      className="detail-btn"
                      onClick={() => handleOpenDetail(row.id)}
                    >
                      상세보기
                    </button>
                  </div>
                  <div>
                    <span
                      className={`status-badge ${
                        STATUS_MAP[row.status]?.color || "gray"
                      }`}
                    >
                      {STATUS_MAP[row.status]?.label || `미정의(${row.status})`}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div
                className="table-row no-data"
                style={{
                  gridColumn: "span 7",
                  padding: "100px 0",
                  textAlign: "center",
                  color: "#999",
                }}
              >
                {loading ? "데이터 로딩 중..." : "데이터가 없습니다."}
              </div>
            )}
          </div>
        </div>

        <div className="pagination">
          <button
            className="page-btn arrow"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            &lt;&lt;
          </button>
          <button
            className="page-btn arrow"
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
            className="page-btn arrow"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
          <button
            className="page-btn arrow"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            &gt;&gt;
          </button>
        </div>
      </section>
      <ReservationDetailModal />
    </div>
  );
}
