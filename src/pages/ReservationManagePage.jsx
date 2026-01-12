import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  fetchRecentReservations,
  updateReservationStatusThunk,
} from "../store/thunks/adminReservationThunk.js";
import LiveClock from "../common/LiveClock.jsx";
import ReassignModal from "../common/ReassignModal.jsx";
import "./ReservationManagePage.css";

const STATUS_MAP = {
  PENDING: { label: "대기", className: "status-pending" },
  CONFIRMED: { label: "확정", className: "status-confirmed" },
  START: { label: "작업 중", className: "status-start" },
  COMPLETED: { label: "완료", className: "status-completed" },
  CANCELED: { label: "취소", className: "status-canceled" },
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
  const [searchParams, setSearchParams] = useSearchParams();

  const urlReservationId = searchParams.get("reservationId") || "";
  const selectedDate = searchParams.get("date") || "";

  const [searchType, setSearchType] = useState(
    urlReservationId ? "reservationId" : "total"
  );
  const [searchInput, setSearchInput] = useState(urlReservationId);
  const [appliedSearch, setAppliedSearch] = useState({
    type: urlReservationId ? "reservationId" : "total",
    value: urlReservationId,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [lastUpdated, setLastUpdated] = useState(dayjs());

  const [updatedId, setUpdatedId] = useState(null);

  const [reassignModal, setReassignModal] = useState({
    open: false,
    target: null,
  });

  const limit = 8;
  const pageGroupSize = 5;

  const {
    recentReservations: reservations,
    totalCount,
    loading,
  } = useSelector((state) => state.adminReservation);

  const loadData = useCallback(() => {
    const filters = {
      page: currentPage,
      limit,
      orderBy: "reservedDate",
      sortBy: "ASC",
    };
    if (appliedSearch.value) {
      const val = appliedSearch.value;
      switch (appliedSearch.type) {
        case "reservationId":
          filters.reservationId = val;
          break;
        case "userName":
          filters.userName = val;
          break;
        case "businessName":
          filters.businessName = val;
          break;
        case "engineerName":
          filters.engineerName = val;
          break;
        default:
          filters.totalSearch = val;
      }
      filters.startDate = "2025-01-01";
      filters.mode = null;
    } else if (selectedDate) {
      filters.reservedDate = selectedDate;
      filters.startDate = selectedDate;
      filters.mode = null;
    } else {
      filters.startDate = dayjs().format("YYYY-MM-DD");
      filters.mode = "future";
    }
    dispatch(fetchRecentReservations(filters));
    setLastUpdated(dayjs());
  }, [dispatch, currentPage, appliedSearch, selectedDate, limit]);

  useEffect(() => {
    loadData();
    const pollingTimer = setInterval(loadData, 60000);
    return () => clearInterval(pollingTimer);
  }, [loadData]);

  const handleReassignSuccess = (id) => {
    setUpdatedId(id);
    loadData();
    setTimeout(() => {
      setUpdatedId(null);
    }, 3000);
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const val = searchInput.trim();
    if (searchType !== "total" && !val) {
      alert("검색어를 입력해 주세요.");
      return;
    }
    setAppliedSearch({ type: searchType, value: val });
    setCurrentPage(1);
    const newParams = {};
    if (selectedDate) newParams.date = selectedDate;
    if (searchType === "reservationId" && val) newParams.reservationId = val;
    setSearchParams(newParams);
  };

  const handleSearchTypeChange = (e) => {
    const newType = e.target.value;
    setSearchType(newType);
    if (newType === "total") {
      setSearchInput("");
      setAppliedSearch({ type: "total", value: "" });
      setCurrentPage(1);
      setSearchParams(selectedDate ? { date: selectedDate } : {});
    }
  };

  const handleReset = () => {
    setSearchType("total");
    setSearchInput("");
    setAppliedSearch({ type: "total", value: "" });
    setCurrentPage(1);
    setSearchParams({});
  };

  const totalPages = Math.ceil((totalCount || 0) / limit) || 1;
  const startPage =
    (Math.ceil(currentPage / pageGroupSize) - 1) * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  const handlePageChange = (pageNum) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    setCurrentPage(pageNum);
  };

  const handleStatusChange = async (id, newStatus) => {
    const statusLabel = STATUS_MAP[newStatus]?.label;
    if (!window.confirm(`예약 상태를 [${statusLabel}]로 변경하시겠습니까?`))
      return;
    try {
      await dispatch(
        updateReservationStatusThunk({ reservationId: id, status: newStatus })
      ).unwrap();
      alert("상태가 변경되었습니다.");
      loadData();
    } catch (err) {
      alert(err?.message || "상태 변경에 실패했습니다.");
    }
  };

  const handleOpenReassign = (row) => {
    setReassignModal({ open: true, target: row });
  };

  return (
    <div className="reservation-manage-container">
      <div className="reservation-manage-header-flex">
        <div className="title-area">
          <h1 className="reservation-manage-greeting">
            {appliedSearch.value
              ? `"${appliedSearch.value}" 검색 결과`
              : selectedDate
              ? `${selectedDate} 예약 현황`
              : "전체 예약 관리 (오늘 이후)"}
          </h1>
          <div className="manage-sync-info">
            <span className="live-dot"></span> 마지막 갱신:{" "}
            {lastUpdated.format("HH:mm:ss")} |{" "}
            <span className="current-time">
              현재 시각: <LiveClock />{" "}
            </span>
          </div>
        </div>
      </div>

      <div className="admin-search-section">
        <form onSubmit={handleSearch} className="admin-search-form">
          <select
            className="admin-search-select"
            value={searchType}
            onChange={handleSearchTypeChange}
          >
            <option value="total">전체검색 (통합)</option>
            <option value="reservationId">예약 ID</option>
            <option value="businessName">매장명</option>
            <option value="userName">고객명</option>
            <option value="engineerName">기사명</option>
          </select>
          <div className="admin-search-input-wrapper">
            <input
              className="admin-search-input"
              type="text"
              placeholder={
                searchType === "total" ? "매장명/고객명/기사명" : "검색어 입력"
              }
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <button type="submit" className="admin-search-submit-btn">
            검색
          </button>
        </form>
        {(appliedSearch.value || selectedDate) && (
          <button onClick={handleReset} className="admin-search-reset-btn">
            초기화
          </button>
        )}
      </div>

      <section className="reservation-manage-table-wrapper">
        <div className="table-header">
          <h2>
            예약 목록 <span>(총 {totalCount || 0}건)</span>
          </h2>
        </div>
        <div className="reservation-manage-table">
          <div className="manage-table-row table-head">
            <div className="col-id">ID</div>
            <div className="col-user">고객 정보</div>
            <div className="col-business">매장명</div>
            <div className="col-machine">브랜드 / 모델명</div>
            <div className="col-engineer">담당 기사</div>
            <div className="col-service">서비스</div>
            <div className="col-date">예약일</div>
            <div className="col-status">상태</div>
          </div>
          <div className={`manage-table-body ${loading ? "is-loading" : ""}`}>
            {reservations?.length > 0
              ? reservations.map((row) => (
                  <div
                    key={row.id}
                    className={`manage-table-row ${
                      row.id === updatedId
                        ? "ReservationManagePage-row-highlight"
                        : ""
                    }`}
                  >
                    <div className="col-id">{row.id}</div>
                    <div className="col-user info-cell">
                      <strong>{row.User?.name || row.user?.name || "-"}</strong>
                      <span className="sub-info">
                        {row.User?.phoneNumber || row.user?.phoneNumber || "-"}
                      </span>
                    </div>
                    <div className="col-business">
                      {row.business?.name || "-"}
                    </div>
                    <div className="col-machine info-cell">
                      <strong>
                        {row.iceMachine
                          ? `${row.iceMachine.brandName} / ${row.iceMachine.modelName}`
                          : "-"}
                      </strong>
                      <span className="sub-info">
                        {formatSize(row.iceMachine?.sizeType)}
                      </span>
                    </div>

                    {/* 담당 기사 컬럼: UI 개선 적용 영역 */}
                    <div className="col-engineer info-cell">
                      {row.engineer ? (
                        <>
                          <div className="engineer-header-row">
                            <strong className="eng-name">
                              {row.engineer.User?.name || row.engineer.name}
                            </strong>
                            <button
                              className="reassign-action-btn"
                              onClick={() => handleOpenReassign(row)}
                            >
                              <svg
                                width="11"
                                height="11"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"></path>
                              </svg>
                              재배정
                            </button>
                          </div>
                          <span className="sub-info">
                            {row.engineer.User?.phoneNumber ||
                              row.engineer.phoneNumber ||
                              "-"}
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="engineer-header-row">
                            <strong className="eng-name unassigned">-</strong>
                            <button
                              className="reassign-action-btn"
                              onClick={() => handleOpenReassign(row)}
                            >
                              기사 배정
                            </button>
                          </div>
                          <span className="sub-info unassigned-text">
                            미배정 상태
                          </span>
                        </>
                      )}
                    </div>

                    <div className="col-service">
                      <span className="service-text">
                        {row.servicePolicy?.serviceType || "-"}
                      </span>
                    </div>
                    <div className="col-date info-cell">
                      <strong>{row.reservedDate}</strong>
                      <span className="sub-info">
                        {row.serviceStartTime
                          ? dayjs(row.serviceStartTime).format("HH:mm")
                          : "00:00"}{" "}
                        ~{" "}
                        {row.serviceEndTime
                          ? dayjs(row.serviceEndTime).format("HH:mm")
                          : "00:00"}
                      </span>
                    </div>
                    <div className="col-status">
                      <select
                        className={`status-select ${
                          STATUS_MAP[row.status]?.className || ""
                        }`}
                        value={row.status}
                        onChange={(e) =>
                          handleStatusChange(row.id, e.target.value)
                        }
                      >
                        <option value={row.status}>
                          {STATUS_MAP[row.status]?.label || row.status}
                        </option>
                        {Object.entries(STATUS_MAP)
                          .filter(([key]) => key !== row.status)
                          .map(([key, value]) => (
                            <option key={key} value={key}>
                              {value.label}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                ))
              : !loading && <div className="no-data-msg">내역이 없습니다.</div>}
          </div>
        </div>

        <div className="pagination">
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
        </div>
      </section>

      {reassignModal.open && (
        <ReassignModal
          isOpen={reassignModal.open}
          onClose={() => setReassignModal({ open: false, target: null })}
          reservationData={reassignModal.target}
          onSuccess={handleReassignSuccess}
        />
      )}
    </div>
  );
}
