import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  fetchDashboardStats,
  fetchRecentReservations,
  fetchReservationDetail,
} from "../store/thunks/adminReservationThunk.js";
import ReservationDetailModal from "./ReservationDetailModal.jsx";
import "./DashboardPage.css";

const STATUS_MAP = {
  PENDING: { label: "접수됨", color: "blue" },
  CONFIRMED: { label: "확정됨", color: "purple" },
  START: { label: "작업중", color: "green" },
  COMPLETED: { label: "완료됨", color: "orange" },
  CANCELED: { label: "취소", color: "red" },
};

export default function DashboardPage() {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [now, setNow] = useState(dayjs());
  const [lastUpdated, setLastUpdated] = useState(dayjs());

  // 필터 상태: "today" (오늘만), "future" (오늘부터 미래 전체)
  const [statMode, setStatMode] = useState("today");

  const limit = 5;
  const pageGroupSize = 5;

  const { stats, recentReservations, loading, totalCount } = useSelector(
    (state) => state.adminReservation
  );

  const loadDashboardData = useCallback(async () => {
    const todayStr = dayjs().format("YYYY-MM-DD");
    // 통계에 보낼 파라미터 결정
    const statsDateParam = statMode === "today" ? todayStr : null;

    // 🔍 [콘솔 로그 1] 요청 파라미터 확인
    console.log(
      `%c[요청 시작] 모드: ${statMode} | 파라미터: ${statsDateParam}`,
      "color: #4f6bed; font-weight: bold"
    );

    try {
      const [statsAction, listAction] = await Promise.all([
        dispatch(fetchDashboardStats(statsDateParam)),
        dispatch(
          fetchRecentReservations({
            page: currentPage,
            limit: limit,
            orderBy: "reservedDate",
            sortBy: "ASC",
            startDate: todayStr,
          })
        ),
      ]);

      // 🔍 [콘솔 로그 2] 통계 응답 데이터 확인
      if (statsAction.payload) {
        console.log(
          "%c[통계 응답]",
          "color: #3aa76d; font-weight: bold",
          statsAction.payload.data
        );
      }

      setLastUpdated(dayjs());
    } catch (err) {
      console.error("❌ [API 에러]:", err);
    }
  }, [dispatch, currentPage, limit, statMode]);

  useEffect(() => {
    loadDashboardData();
    const pollingTimer = setInterval(loadDashboardData, 60000);
    const clockTimer = setInterval(() => setNow(dayjs()), 1000);
    return () => {
      clearInterval(pollingTimer);
      clearInterval(clockTimer);
    };
  }, [loadDashboardData]);

  const totalPages = Math.ceil((totalCount || 0) / limit) || 1;
  const currentGroup = Math.ceil(currentPage / pageGroupSize);
  const startPage = (currentGroup - 1) * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

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
              현재 시각: {now.format("HH:mm:ss")}
            </span>
          </div>
        </div>

        <div className="stats-toggle-area">
          <span className="toggle-label">통계 현황 기준:</span>
          <div className="toggle-group">
            <button
              className={`toggle-btn ${statMode === "today" ? "active" : ""}`}
              onClick={() => setStatMode("today")}
            >
              오늘
            </button>
            <button
              className={`toggle-btn ${statMode === "future" ? "active" : ""}`}
              onClick={() => setStatMode("future")}
            >
              전체 (오늘~)
            </button>
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
            오늘 이후 예약{" "}
            <span>
              (페이지: {currentPage} / {totalPages})
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
                        STATUS_MAP[row.status]?.label || ""
                      }`}
                    >
                      {STATUS_MAP[row.status]?.label || row.status}
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
                  color: "#999",
                }}
              >
                {loading
                  ? "데이터 로딩 중..."
                  : "오늘 이후 예정된 예약 내역이 없습니다."}
              </div>
            )}
          </div>
        </div>

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
      </section>
      <ReservationDetailModal />
    </div>
  );
}
