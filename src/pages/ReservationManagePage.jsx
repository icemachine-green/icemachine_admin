import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  fetchRecentReservations,
  updateReservationStatusThunk,
} from "../store/thunks/adminReservationThunk.js";
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
  const [now, setNow] = useState(dayjs());
  const [lastUpdated, setLastUpdated] = useState(dayjs());

  const limit = 8;
  const pageGroupSize = 5;

  const {
    recentReservations: reservations,
    totalCount,
    loading,
  } = useSelector((state) => state.adminReservation);

  const getPlaceholder = () => {
    switch (searchType) {
      case "reservationId":
        return "예약 ID (숫자만)";
      case "userName":
        return "고객명 검색";
      case "engineerName":
        return "담당 기사명 검색";
      case "businessName":
        return "매장명 검색";
      case "total":
        return "전체보기 모드 (입력 불가)";
      default:
        return "검색어를 입력하세요";
    }
  };

  const handleInputChange = (e) => {
    let val = e.target.value;
    if (searchType === "reservationId") val = val.replace(/[^0-9]/g, "");
    setSearchInput(val);
  };

  const loadData = useCallback(() => {
    const todayStr = dayjs().format("YYYY-MM-DD");
    const filters = {
      page: currentPage,
      limit,
      reservedDate: selectedDate,
      orderBy: "reservedDate",
      sortBy: "ASC",
      startDate: !selectedDate && !appliedSearch.value ? todayStr : null,
    };

    if (appliedSearch.value) {
      const key =
        appliedSearch.type === "total" ? "totalSearch" : appliedSearch.type;
      filters[key] = appliedSearch.value;
    }

    dispatch(fetchRecentReservations(filters));
    setLastUpdated(dayjs());
  }, [dispatch, currentPage, appliedSearch, selectedDate]);

  useEffect(() => {
    loadData();
    const pollingTimer = setInterval(loadData, 60000);
    const clockTimer = setInterval(() => setNow(dayjs()), 1000);
    return () => {
      clearInterval(pollingTimer);
      clearInterval(clockTimer);
    };
  }, [loadData]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchType === "total") return;

    const val = searchInput.trim();
    if (!val) {
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
    setSearchInput("");

    if (newType === "total") {
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
    window.scrollTo(0, 0);
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
            <span className="live-dot"></span>
            마지막 갱신: {lastUpdated.format("HH:mm:ss")} |{" "}
            <span className="current-time">
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

      <div className="admin-search-section">
        <form onSubmit={handleSearch} className="admin-search-form">
          <select
            className="admin-search-select"
            value={searchType}
            onChange={handleSearchTypeChange}
          >
            <option value="total">전체보기 (기본)</option>
            <option value="reservationId">예약 ID</option>
            <option value="businessName">고객 매장명</option>
            <option value="userName">고객명</option>
            <option value="engineerName">담당 기사명</option>
          </select>

          <div className="admin-search-input-wrapper">
            <input
              className={`admin-search-input ${
                searchType === "total" ? "disabled" : ""
              }`}
              type="text"
              placeholder={getPlaceholder()}
              value={searchInput}
              onChange={handleInputChange}
              disabled={searchType === "total"}
            />
          </div>

          <button
            type="submit"
            className="admin-search-submit-btn"
            disabled={searchType === "total"}
            style={{
              opacity: searchType === "total" ? 0.5 : 1,
              cursor: searchType === "total" ? "not-allowed" : "pointer",
            }}
          >
            검색
          </button>
        </form>

        {(appliedSearch.value || selectedDate) && (
          <button onClick={handleReset} className="admin-search-reset-btn">
            필터 초기화
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
            <div className="col-machine">제빙기 모델/사이즈</div>
            <div className="col-engineer">담당 기사</div>
            <div className="col-service">서비스</div>
            <div className="col-date">예약일(시간)</div>
            <div className="col-status">상태</div>
          </div>
          <div className={`manage-table-body ${loading ? "is-loading" : ""}`}>
            {reservations?.length > 0 ? (
              reservations.map((row) => (
                <div key={row.id} className="manage-table-row">
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
                    <strong>{row.iceMachine?.modelName || "-"}</strong>
                    <span className="sub-info">
                      {formatSize(row.iceMachine?.sizeType)}
                    </span>
                  </div>

                  {/* 기사 출력부: 콘솔 데이터 구조 {name, phoneNumber}에 맞춰 수정 */}
                  <div className="col-engineer info-cell">
                    {row.engineer ? (
                      <>
                        <strong>{row.engineer.name}</strong>
                        <span className="sub-info">
                          {row.engineer.phoneNumber || "-"}
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
                      {Object.entries(STATUS_MAP).map(([key, value]) => (
                        <option
                          key={key}
                          value={key}
                          style={{
                            display: row.status === key ? "none" : "block",
                          }}
                        >
                          {value.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data-msg">
                {loading
                  ? "데이터 로딩 중..."
                  : "조건에 맞는 예약 내역이 없습니다."}
              </div>
            )}
          </div>
        </div>

        <div className="pagination">
          {currentPage > pageGroupSize && (
            <button
              className="page-btn double-arrow"
              onClick={() => handlePageChange(1)}
            >
              &lt;&lt;
            </button>
          )}
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
          {endPage < totalPages && (
            <button
              className="page-btn double-arrow"
              onClick={() => handlePageChange(totalPages)}
            >
              &gt;&gt;
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
