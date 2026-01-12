import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { fetchDelayMonitorData } from "../../store/thunks/delayAlertThunk";
import SideBar from "../sidebar/SideBar";
import DelayAlertManager from "../../common/DelayAlertManager.jsx";
import "./MainLayout.css";

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { admin } = useSelector((state) => state.auth);
  // 🚩 수정: 슬라이스에서 필터링이 완료된 delayedItems를 직접 가져옵니다.
  const { delayedItems, loading } = useSelector((state) => state.delayAlert);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 1. 실시간 감시: 인증(admin)이 확인된 경우에만 1분마다 데이터 갱신
  useEffect(() => {
    if (admin) {
      dispatch(fetchDelayMonitorData());
      const timer = setInterval(() => {
        dispatch(fetchDelayMonitorData());
      }, 60000); // 60000: 1분
      return () => clearInterval(timer);
    }
  }, [dispatch, admin]); // admin을 의존성에 추가하여 401 에러 방지

  // 2. 지연 건수: 리덕스에서 가져온 배열의 길이를 그대로 사용
  // 슬라이스 내부에서 이미 'START + 시간 경과' 로직으로 필터링되어 있습니다.
  const delayCount = delayedItems?.length || 0;
  const TITLE_MAP = {
    "/": "대시보드",
    "/service": "서비스 정책",
    "/reservation": "예약 관리",
    "/driver": "기사 관리",
    "/customer": "고객 관리",
    "/admin": "관리자 계정 관리",
    "/reservation/delay": "작업 지연 관리",
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

  return (
    <div className="main-layout-container">
      <SideBar />

      <div className="main-layout-inner">
        <header className="header">
          <div className="header-left">
            <h1>{title}</h1>
          </div>

          <div
            className="header-right"
            style={{ display: "flex", alignItems: "center" }}
          >
            {/* 🚨 지연 감시 버튼: 숫자가 있을 때만 빨간색으로 강조 */}
            <button
              className="header-delay-monitor-btn"
              onClick={() => navigate("/reservation/delay")}
              style={{
                marginRight: "20px",
                padding: "8px 14px",
                backgroundColor: delayCount > 0 ? "#ff4d4f" : "#f0f0f0",
                color: delayCount > 0 ? "#fff" : "#666",
                borderRadius: "8px",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignSelf: "center",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease",
              }}
            >
              🚨 지연 감시
              {delayCount > 0 && (
                <span
                  style={{
                    backgroundColor: "rgba(0,0,0,0.15)",
                    padding: "2px 8px",
                    borderRadius: "10px",
                    fontSize: "12px",
                  }}
                >
                  {delayCount}
                </span>
              )}
            </button>

            <img
              className="header-icon"
              src="/icons/jong_icon.png"
              alt="알림"
              style={{ marginRight: "15px" }}
            />

            <div
              className="header-user"
              ref={dropdownRef}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span className="admin-name" style={{ marginRight: "8px" }}>
                {admin?.name || "관리자"}님
              </span>
              <button
                className={`arrow-toggle ${isOpen ? "open" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
              />
              {isOpen && (
                <div
                  className="admin-dropdown"
                  style={{
                    position: "absolute",
                    top: "120%",
                    right: 0,
                    background: "#fff",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    padding: "10px",
                    borderRadius: "4px",
                    zIndex: 1000,
                    minWidth: "120px",
                  }}
                >
                  <button
                    onClick={() => {
                      dispatch(logout());
                      navigate("/login");
                    }}
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "none",
                      background: "#f5f5f5",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
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
      </div>

      {/* 🚩 알림 매니저: 백그라운드에서 지연 발생 시 토스트 알림을 띄움 */}
      <DelayAlertManager />
    </div>
  );
}
