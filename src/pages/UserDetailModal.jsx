import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearSelectedUser } from "../store/slices/adminUserManageSlice";
import "./UserDetailModal.css";

export default function UserDetailModal() {
  const dispatch = useDispatch();
  const { selectedUser, loadingDetail } = useSelector(
    (state) => state.adminUserManage
  );

  if (!selectedUser && !loadingDetail) return null;

  const handleClose = () => {
    dispatch(clearSelectedUser());
  };

  // 🚩 로그 데이터 구조에 따른 매핑 로직 수정
  const user = selectedUser?.profile; // 이름, 이메일 등이 들어있는 객체
  const businesses = selectedUser?.businesses || []; // 매장 리스트
  const history = selectedUser?.history || []; // 서비스 히스토리

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>고객 상세 정보 (ID: {user?.id})</h2>
          <button className="close-x-btn" onClick={handleClose}>
            &times;
          </button>
        </header>

        {loadingDetail ? (
          <div className="modal-loading-wrapper">
            <div className="spinner"></div>
            <p>데이터를 불러오는 중입니다...</p>
          </div>
        ) : (
          <div className="modal-body">
            {/* 1. 기본 정보 - profile 객체에서 가져옴 */}
            <section className="modal-section">
              <h3 className="section-title">기본 정보</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>고객명</label>
                  <span>{user?.name}</span>
                </div>
                <div className="info-item">
                  <label>연락처</label>
                  <span>{user?.phoneNumber}</span>
                </div>
                <div className="info-item">
                  <label>이메일</label>
                  <span>{user?.email || "-"}</span>
                </div>
                <div className="info-item">
                  <label>가입일</label>
                  <span>{user?.createdAt?.split(" ")[0]}</span>
                </div>
              </div>
            </section>

            {/* 2. 등록 매장 정보 - businesses 배열에서 가져옴 */}
            <section className="modal-section">
              <h3 className="section-title">등록 매장 ({businesses.length})</h3>
              <div className="business-list">
                {businesses.map((biz) => (
                  <div key={biz.id} className="business-card">
                    <div className="biz-header">
                      <span className="biz-name">{biz.name}</span>
                      <span className="biz-manager">
                        매장 담당자: {biz.managerName}
                      </span>
                    </div>
                    <p className="biz-addr">
                      {biz.mainAddress} {biz.detailedAddress}
                    </p>
                    <div className="biz-extra">
                      <span>제빙기: {biz.iceMachines?.length || 0}대</span>
                      <span>연락처: {biz.phoneNumber}</span>
                    </div>
                  </div>
                ))}
                {businesses.length === 0 && (
                  <p className="no-data-text">등록된 매장이 없습니다.</p>
                )}
              </div>
            </section>

            {/* 3. 서비스 히스토리 - history 배열에서 가져옴 */}
            <section className="modal-section">
              <h3 className="section-title">
                서비스 히스토리 ({history.length})
              </h3>
              <div className="modal-table-wrapper">
                <table className="modal-table">
                  <thead>
                    <tr>
                      <th>점검일</th>
                      <th>매장명</th>
                      <th>서비스 구분</th>
                      <th>담당 엔지니어</th>
                      <th>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((res) => (
                      <tr key={res.id}>
                        <td>{res.reservedDate}</td>
                        <td>{res.Business?.name || "-"}</td>
                        <td>
                          <span className="service-type-tag">
                            {res.ServicePolicy?.serviceType} (
                            {res.ServicePolicy?.sizeType})
                          </span>
                        </td>
                        <td>
                          {res.engineerName || res.Engineer?.name || "미지정"}
                        </td>
                        <td>
                          <span className={`status-tag ${res.status}`}>
                            {res.status === "COMPLETED"
                              ? "완료"
                              : res.status === "CONFIRMED"
                              ? "확정"
                              : res.status === "CANCELLED"
                              ? "취소"
                              : res.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {history.length === 0 && (
                      <tr>
                        <td colSpan="5" className="no-data">
                          이력이 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
