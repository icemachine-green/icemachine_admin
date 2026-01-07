import { Outlet, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import SideBar from "../sidebar/SideBar";
import "./MainLayout.css";

export default function MainLayout() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

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

  const handleLogoutClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmYes = () => {
    setShowConfirmModal(false);
    setShowCompleteModal(true);
    dispatch(logout());
  };

  const handleConfirmNo = () => setShowConfirmModal(false);
  const handleCompleteClose = () => setShowCompleteModal(false);

  return (
    <div className="main-layout-container">
      {/* 1. 왼쪽 사이드바 고정 */}
      <SideBar />

      {/* 2. 오른쪽 전체 영역 (헤더 + 콘텐츠) */}
      <div className="main-layout-inner">
        <header className="header">
          <div className="header-left">
            <h1>{title}</h1>
          </div>

          <div className="header-right">
            <img
              className="header-icon"
              src="/icons/jong_icon.png"
              alt="알림"
            />
            <img
              className="header-icon"
              src="/icons/memo_icon.png"
              alt="메모"
            />

            <div className="header-user" ref={dropdownRef}>
              <img
                className="admin-icon"
                src="/icons/admin_icon.png"
                alt="관리자"
              />
              <span className="admin-name">{admin?.name || "관리자"}님</span>

              <button
                className={`arrow-toggle ${isOpen ? "open" : ""}`}
                onClick={() => setIsOpen((prev) => !prev)}
              />

              {isOpen && (
                <div className="admin-dropdown">
                  <p className="dropdown-name">{admin?.username || "admin"}</p>
                  <div className="dropdown-divider" />
                  <button className="logout-btn" onClick={handleLogoutClick}>
                    로그아웃 하기
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 실제 대시보드 등의 내용이 나오는 영역 */}
        <section className="content">
          <Outlet />
        </section>
      </div>

      {/* 모달 레이어 */}
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

      {showCompleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p className="modal-title">로그아웃 되었습니다.</p>
            <div className="modal-actions single">
              <button
                className="modal-btn confirm"
                onClick={handleCompleteClose}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
