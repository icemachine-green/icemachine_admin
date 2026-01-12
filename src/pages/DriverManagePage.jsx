import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEngineers } from "../store/thunks/adminEngineerThunk";
import EngineerDetailModal from "./EngineerDetailModal.jsx";
import "./DriverManagePage.css";

export default function DriverManagePage() {
  const dispatch = useDispatch();

  // 상태 관리
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState(null);

  const limit = 10;
  const pageGroupSize = 5; // 한 번에 보여줄 페이지 번호 개수

  const { engineers, totalCount, loading, summary } = useSelector(
    (state) => state.adminEngineer
  );

  // 데이터 로드 함수
  const loadData = useCallback(() => {
    dispatch(fetchEngineers({ page: currentPage, limit }));
  }, [dispatch, currentPage, limit]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 행 클릭 시 상세 모달 오픈
  const handleRowClick = (engineer) => {
    setSelectedEngineer(engineer);
    setIsModalOpen(true);
  };

  // 모달 닫기 및 데이터 갱신 처리
  const handleCloseModal = (shouldRefresh) => {
    setIsModalOpen(false);
    setSelectedEngineer(null);
    if (shouldRefresh === true) loadData();
  };

  // ================= [페이지네이션 로직 보정] =================
  // 로그 확인 결과 totalCount가 undefined일 수 있어 summary.totalEngineers를 예비책으로 사용
  const finalTotalCount = Number(totalCount || summary?.totalEngineers || 0);
  const totalPages = Math.ceil(finalTotalCount / limit) || 1;

  // 현재 페이지가 속한 그룹의 시작/끝 계산
  const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
  const startPage = currentGroup * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  const handlePageChange = (pageNum) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    setCurrentPage(pageNum);
  };
  // =========================================================

  return (
    <div className="driviermanage-container">
      <h1 className="driviermanage-greeting">
        기사 정보와 작업 현황을 관리할 수 있습니다.
        <span className="summary-info">
          (활성 기사: {summary?.activeEngineers || 0}명 / 전체:{" "}
          {finalTotalCount}명)
        </span>
      </h1>

      <section className="driviermanage-table-wrapper">
        <div className="driviermanage-table">
          {/* 테이블 헤더 */}
          <div className="driver-table-row driver-table-head">
            <div>ID</div>
            <div>기사명</div>
            <div>기술등급</div>
            <div>연락처</div>
            <div>입사일</div>
            <div>누적완료</div>
            <div>상태</div>
          </div>

          {/* 테이블 바디 */}
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
                    {/* 입사일: xxxx-xx-xx 포맷으로 잘라내기 */}
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

          {/* 페이지네이션 UI (중앙 정렬 보정) */}
          <div className="pagination">
            <button
              className="page-btn arrow"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              &laquo;
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
