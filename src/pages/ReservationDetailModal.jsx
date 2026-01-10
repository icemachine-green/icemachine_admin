import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearSelectedReservation } from "../store/slices/adminReservationSlice";
import { useNavigate } from "react-router-dom";
import "./ReservationDetailModal.css";

const STATUS_MAP = {
  PENDING: { label: "접수됨", color: "blue" },
  CONFIRMED: { label: "확정됨", color: "purple" },
  START: { label: "작업중", color: "green" },
  COMPLETED: { label: "완료됨", color: "orange" },
  CANCELED: { label: "취소", color: "red" },
};

export default function ReservationDetailModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedReservation: data, loading } = useSelector(
    (state) => state.adminReservation
  );

  // 데이터가 없으면 렌더링하지 않음
  if (!data && !loading) return null;

  // 닫기 로직
  const handleClose = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    dispatch(clearSelectedReservation());
  };

  const handleGoToManage = (e) => {
    if (e) e.preventDefault();

    const targetId = data?.id;
    dispatch(clearSelectedReservation());

    if (targetId) {
      navigate(`/reservation?reservationId=${targetId}`);
    } else {
      navigate(`/reservation`);
    }
  };

  return (
    <div
      className={`ReservationDetailModal-overlay ${data ? "show" : ""}`}
      onClick={handleClose}
    >
      <div
        className="ReservationDetailModal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="ReservationDetailModal-header">
          <div className="ReservationDetailModal-header-left">
            <h2>예약 상세 정보</h2>
            <span className="ReservationDetailModal-id-tag">
              No. {data?.id}
            </span>
            {data && (
              <span
                className={`status-badge ${
                  STATUS_MAP[data.status]?.color || ""
                }`}
              >
                {STATUS_MAP[data.status]?.label || data.status}
              </span>
            )}
          </div>
          <button
            type="button"
            className="ReservationDetailModal-close-x"
            onClick={handleClose}
          >
            &times;
          </button>
        </header>

        {loading ? (
          <div className="ReservationDetailModal-loading">
            데이터를 로딩 중입니다...
          </div>
        ) : (
          data && (
            <div className="ReservationDetailModal-body">
              <div className="ReservationDetailModal-grid">
                <div className="ReservationDetailModal-group">
                  <label>예약 날짜</label>
                  <p className="ReservationDetailModal-text-important">
                    {data.reservedDate}
                  </p>
                </div>
                <div className="ReservationDetailModal-group">
                  <label>서비스 시간</label>
                  <p className="ReservationDetailModal-text-base">
                    {/* 백엔드 DTO 구조 반영 */}
                    {data.serviceStartTime?.substring(11, 16)} ~{" "}
                    {data.serviceEndTime?.substring(11, 16)}
                  </p>
                </div>
              </div>

              <hr className="ReservationDetailModal-divider" />

              <div className="ReservationDetailModal-grid">
                <div className="ReservationDetailModal-group">
                  <label>고객 정보</label>
                  <p className="ReservationDetailModal-text-bold">
                    {data.user?.name}
                  </p>
                  <p className="ReservationDetailModal-text-base">
                    {data.user?.phoneNumber}
                  </p>
                </div>
                <div className="ReservationDetailModal-group">
                  <label>업체 및 주소</label>
                  <p className="ReservationDetailModal-text-bold">
                    {data.business?.name}
                  </p>
                  <p className="ReservationDetailModal-address-text">
                    {data.business?.address}
                  </p>
                </div>
              </div>

              <hr className="ReservationDetailModal-divider" />

              <div className="ReservationDetailModal-grid">
                <div className="ReservationDetailModal-group">
                  <label>서비스 유형</label>
                  <p className="ReservationDetailModal-text-base">
                    {data.servicePolicy?.serviceType}
                  </p>
                </div>
                <div className="ReservationDetailModal-group">
                  <label>제빙기 모델</label>
                  <p className="ReservationDetailModal-text-base">
                    {/* brandName + modelName 조합으로 표시 */}
                    {data.iceMachine?.brandName} {data.iceMachine?.modelName}
                  </p>
                  <p className="ReservationDetailModal-text-sub">
                    {data.iceMachine?.sizeType}
                  </p>
                </div>
              </div>

              <div className="ReservationDetailModal-engineer-box">
                <label className="ReservationDetailModal-engineer-label">
                  담당 엔지니어
                </label>
                {data.engineer ? (
                  <div className="ReservationDetailModal-engineer-info">
                    <div className="ReservationDetailModal-engineer-main">
                      <span className="ReservationDetailModal-engineer-name">
                        {data.engineer.name} 기사
                      </span>
                    </div>
                    <p className="ReservationDetailModal-engineer-phone">
                      {data.engineer.phoneNumber}
                    </p>
                  </div>
                ) : (
                  <p className="ReservationDetailModal-unassigned-text">
                    배정된 엔지니어가 없습니다.
                  </p>
                )}
              </div>
            </div>
          )
        )}

        <footer className="ReservationDetailModal-footer">
          <button
            type="button"
            className="ReservationDetailModal-footer-btn manage"
            onClick={handleGoToManage}
          >
            이 예약 관리 페이지로 이동
          </button>
          <button
            type="button"
            className="ReservationDetailModal-footer-btn close"
            onClick={handleClose}
          >
            닫기
          </button>
        </footer>
      </div>
    </div>
  );
}
