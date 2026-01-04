import { Outlet, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./MainLayout.css";

export default function MainLayout() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  /* 🔹 모달 상태 추가 */
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const dropdownRef = useRef(null);

  const TITLE_MAP = {
    "/": "대시보드",
    "/service": "서비스 정책",
    "/reservation": "예약 관리",
    "/driver": "기사 관리",
    "/customer": "고객 관리",
    "/admin": "관리자 계정 관리",
  };

  const title = TITLE_MAP[location.pathname] || "대시보드";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* 🔹 로그아웃 흐름 */
  const handleLogoutClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmYes = () => {
    setShowConfirmModal(false);
    setShowCompleteModal(true);

    // 👉 실제 로그아웃 로직은 여기서 추가 가능
    // localStorage.clear();
    // navigate("/admin/login");
  };

  const handleConfirmNo = () => {
    setShowConfirmModal(false);
  };

  const handleCompleteClose = () => {
    setShowCompleteModal(false);
  };

  return (
    <main className="main-layout">
      <header className="header">
        <div className="header-left">
          <h1>{title}</h1>
        </div>

        <div className="header-right">
          <img className="header-icon" src="/icons/jong_icon.png" alt="종아이콘" />
          <img className="header-icon" src="/icons/memo_icon.png" alt="메모아이콘" />

          <div className="header-user" ref={dropdownRef}>
            <img
              className="admin-icon"
              src="/icons/admin_icon.png"
              alt="관리자로그인아이콘"
            />
            <span className="admin-name">admin 계정 관리자</span>

            <button
              className={`arrow-toggle ${isOpen ? "open" : ""}`}
              onClick={() => setIsOpen((prev) => !prev)}
            />

            {isOpen && (
              <div className="admin-dropdown">
                <p className="dropdown-name">admin 계정 관리자</p>
                <div className="dropdown-divider" />
                <button className="logout-btn" onClick={handleLogoutClick}>
                  로그아웃 하기
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="content">
        <Outlet />
      </section>

      {/* =========================
          로그아웃 확인 모달
      ========================= */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p className="modal-title">로그아웃 하시겠습니까?</p>

            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={handleConfirmNo}>
                아니오
              </button>
              <button className="modal-btn confirm" onClick={handleConfirmYes}>
                예
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          로그아웃 완료 모달
      ========================= */}
      {showCompleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p className="modal-title">로그아웃 되었습니다.</p>

            <div className="modal-actions single">
              <button className="modal-btn confirm" onClick={handleCompleteClose}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
