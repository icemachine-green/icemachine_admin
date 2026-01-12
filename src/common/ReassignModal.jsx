import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRecommendedEngineers,
  assignEngineer,
} from "../store/thunks/adminReassignThunk.js";
import { resetReassignState } from "../store/slices/adminReassignSlice.js";
import "./ReassignModal.css";

export default function ReassignModal({
  isOpen,
  onClose,
  reservationData,
  onSuccess,
}) {
  const dispatch = useDispatch();
  const { recommendedEngineers, loading, assignLoading } = useSelector(
    (state) => state.adminReassign
  );

  useEffect(() => {
    if (isOpen && reservationData?.id) {
      dispatch(fetchRecommendedEngineers(reservationData.id));
    }
    return () => dispatch(resetReassignState());
  }, [isOpen, reservationData?.id, dispatch]);

  const availableList = recommendedEngineers.filter((eng) => eng.isAvailable);

  const handleAssign = async (engineerId, engineerName) => {
    if (!window.confirm(`[${engineerName}] 기사님을 배정하시겠습니까?`)) return;
    try {
      await dispatch(
        assignEngineer({ reservationId: reservationData.id, engineerId })
      ).unwrap();

      alert(`${engineerName} 기사님으로 재배정이 완료되었습니다.`);
      onSuccess(reservationData.id);
      onClose();
    } catch (err) {
      alert(err || "배정 중 오류가 발생했습니다.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ReassignModal-overlay" onClick={onClose}>
      <div className="ReassignModal-card" onClick={(e) => e.stopPropagation()}>
        <header className="ReassignModal-header">
          <div className="ReassignModal-header-left">
            <h2 className="ReassignModal-main-title">
              현재 투입 가능 기사 우선 순위 목록
            </h2>
            <div className="ReassignModal-sub-info-area">
              <span className="ReassignModal-info-item">
                ID: #{reservationData?.id}
              </span>
              <span className="ReassignModal-info-divider">|</span>
              <span className="ReassignModal-info-item">
                매장: {reservationData?.business?.name}
              </span>
              <span className="ReassignModal-info-divider">|</span>
              <span className="ReassignModal-info-item">
                고객:{" "}
                {reservationData?.user?.name || reservationData?.User?.name}
              </span>
            </div>
          </div>
          <div className="ReassignModal-header-right">
            <div className="ReassignModal-status-chip">
              가용 가능 <strong>{availableList.length}</strong>
            </div>
            <button className="ReassignModal-x-button" onClick={onClose}>
              &times;
            </button>
          </div>
        </header>

        <div className="ReassignModal-content">
          {/* 고정 헤더 영역 */}
          <div className="ReassignModal-list-header">
            <div className="ReassignModal-col-1">기사/연락처</div>
            <div className="ReassignModal-col-2">이동거리</div>
            <div className="ReassignModal-col-3">여유시간</div>
            <div className="ReassignModal-col-4">오늘 예약</div>
            <div className="ReassignModal-col-5">선택</div>
          </div>

          {/* 스크롤 리스트 영역 */}
          <div className="ReassignModal-list-body">
            {loading ? (
              <div className="ReassignModal-state-msg">데이터 분석 중...</div>
            ) : availableList.length === 0 ? (
              <div className="ReassignModal-state-msg">
                현재 가용한 기사가 없습니다.
              </div>
            ) : (
              availableList.map((eng) => (
                <div key={eng.engineerId} className="ReassignModal-list-row">
                  <div className="ReassignModal-col-1">
                    <div className="ReassignModal-eng-box">
                      <span className="ReassignModal-eng-name">{eng.name}</span>
                      <span className="ReassignModal-eng-phone">
                        {eng.phoneNumber}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`ReassignModal-col-2 ReassignModal-bold ${
                      eng.distanceKm === null ? "ReassignModal-blue" : ""
                    }`}
                  >
                    {eng.distanceKm !== null
                      ? `${eng.distanceKm}km`
                      : "첫 일정"}
                  </div>
                  <div className="ReassignModal-col-3 ReassignModal-bold ReassignModal-green">
                    {eng.totalRestTime}분
                  </div>
                  <div className="ReassignModal-col-4 ReassignModal-bold">
                    {eng.todayJobCount}건
                  </div>
                  <div className="ReassignModal-col-5">
                    <button
                      className="ReassignModal-action-btn"
                      onClick={() => handleAssign(eng.engineerId, eng.name)}
                      disabled={assignLoading}
                    >
                      배정
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
