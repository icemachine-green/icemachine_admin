import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const limit = 5; // 대시보드는 5개 고정
  const pageGroupSize = 5;

  const { stats, recentReservations, loading, totalCount } = useSelector(
    (state) => state.adminReservation
  );

  useEffect(() => {
    dispatch(fetchDashboardStats());
    // 관리 페이지와 정렬 기준 통일 (날짜 최신 + 시간 빠른순)
    dispatch(
      fetchRecentReservations({
        page: currentPage,
        limit: limit,
        orderBy: "serviceStartTime",
        sortBy: "ASC",
      })
    );
  }, [dispatch, currentPage]);

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
      <h1 className="dashboard-greeting">
        안녕하세요, 관리자님! 대시보드입니다.
      </h1>

      <section className="dashboard-stats">
        {Object.keys(STATUS_MAP).map((key) => (
          <div key={key} className="stat-card">
            <strong>{(stats[key] || 0).toLocaleString()}</strong>
            <span className={STATUS_MAP[key].color}>
              {STATUS_MAP[key].label}
            </span>
          </div>
        ))}
      </section>

      <section className="dashboard-table-wrapper">
        <div className="table-header">
          <h2>
            최근 예약{" "}
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
              <div className="table-row no-data">
                {loading ? "데이터 로딩 중..." : "해당 내역이 없습니다."}
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
