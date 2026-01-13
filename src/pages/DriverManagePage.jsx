import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEngineers } from "../store/thunks/adminEngineerThunk";
import EngineerDetailModal from "./EngineerDetailModal.jsx";
import "./DriverManagePage.css";

export default function DriverManagePage() {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState(null);

  const limit = 10;
  const pageGroupSize = 5;

  // thunk가 성공하면 payload.summary에 통계 데이터가 담기므로 스토어에서 바로 참조
  const { engineers, totalCount, loading, summary } = useSelector(
    (state) => state.adminEngineer
  );

  const loadData = useCallback(() => {
    dispatch(fetchEngineers({ page: currentPage, limit }));
  }, [dispatch, currentPage, limit]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRowClick = (engineer) => {
    setSelectedEngineer(engineer);
    setIsModalOpen(true);
  };

  const handleCloseModal = (shouldRefresh) => {
    setIsModalOpen(false);
    setSelectedEngineer(null);
    if (shouldRefresh === true) loadData();
  };

  // 페이지네이션 로직
  const finalTotalCount = Number(totalCount || 0);
  const totalPages = Math.ceil(finalTotalCount / limit) || 1;
  const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
  const startPage = currentGroup * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  return (
    <div className="driviermanage-container">
      <header className="page-header">
        <h1 className="driviermanage-greeting">기사 및 인력 현황</h1>
      </header>

      {/* 서비스 로직에서 합쳐서 내려주는 summary 데이터 활용 */}
      <section className="summary-cards-container">
        <div className="summary-card total">
          <span className="card-label">전체 기사</span>
          <strong className="card-value">{summary?.totalEngineers || 0}</strong>
        </div>
        <div className="summary-card active">
          <span className="card-label">활동 중</span>
          <strong className="card-value">
            {summary?.activeEngineers || 0}
          </strong>
        </div>
        <div className="summary-card inactive">
          <span className="card-label">비활성</span>
          <strong className="card-value">
            {summary?.inactiveEngineers || 0}
          </strong>
        </div>
        <div className="summary-card resigned">
          <span className="card-label">퇴사</span>
          <strong className="card-value">
            {summary?.resignedEngineers || 0}
          </strong>
        </div>
      </section>

      <section className="driviermanage-table-wrapper">
        <div className="driviermanage-table">
          <div className="driver-table-row driver-table-head">
            <div>ID</div>
            <div>기사명</div>
            <div>기술등급</div>
            <div>연락처</div>
            <div>입사일</div>
            <div>누적완료</div>
            <div>상태</div>
          </div>

          <div className={`driver-table-body ${loading ? "is-loading" : ""}`}>
            {engineers?.length > 0
              ? engineers.map((engineer) => (
                  <div
                    className="driver-table-row clickable-row"
                    key={engineer.id}
                    onClick={() => handleRowClick(engineer)}
                  >
                    <div>{engineer.id}</div>
                    <div className="emp-name">
                      {engineer.User?.name || "미지정"}
                    </div>
                    <div>{engineer.skillLevel}</div>
                    <div>{engineer.User?.phoneNumber || "-"}</div>
                    <div>{engineer.createdAt?.split("T")[0] || "-"}</div>
                    <div className="completed-count">
                      {engineer.totalCompletedCount || 0}건
                    </div>
                    <div>
                      <span
                        className={`status-badge ${
                          engineer.displayStatus === "활성"
                            ? "greencolor"
                            : engineer.displayStatus === "퇴사"
                            ? "redcolor"
                            : "graycolor"
                        }`}
                      >
                        {engineer.displayStatus}
                      </span>
                    </div>
                  </div>
                ))
              : !loading && (
                  <div className="no-data">조회된 기사가 없습니다.</div>
                )}
          </div>

          <div className="pagination">
            <button
              className="page-btn arrow"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              &laquo;
            </button>
            <button
              className="page-btn arrow"
              onClick={() => setCurrentPage((p) => p - 1)}
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
                onClick={() => setCurrentPage(num)}
              >
                {num}
              </button>
            ))}
            <button
              className="page-btn arrow"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
            <button
              className="page-btn arrow"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              &raquo;
            </button>
          </div>
        </div>
      </section>

      <EngineerDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        engineer={selectedEngineer}
      />
    </div>
  );
}
