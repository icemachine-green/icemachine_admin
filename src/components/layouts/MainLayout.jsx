import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
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
  const { delayedItems } = useSelector((state) => state.delayAlert);

  const [isOpen, setIsOpen] = useState(false);

  // 초기값 로드: LocalStorage에 'delayMuted'가 'true'라면 true, 아니면 false
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem("delayMuted") === "true";
  });

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (admin) {
      dispatch(fetchDelayMonitorData());
      const timer = setInterval(() => {
        dispatch(fetchDelayMonitorData());
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [dispatch, admin]);

  // isMuted 상태가 바뀔 때마다 LocalStorage에 저장
  useEffect(() => {
    localStorage.setItem("delayMuted", isMuted);
  }, [isMuted]);

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

          <div className="header-right">
            <button
              className={`header-delay-monitor-btn ${
                delayCount > 0 ? "active" : ""
              }`}
              onClick={() => navigate("/reservation/delay")}
            >
              지연 감시
              {delayCount > 0 && (
                <span className="delay-badge">{delayCount}</span>
              )}
            </button>

            <button
              className={`header-alarm-toggle ${isMuted ? "muted" : ""}`}
              onClick={() => setIsMuted(!isMuted)}
            >
              <img
                className="header-icon"
                src="/icons/jong_icon.png"
                alt="알림"
              />
              {isMuted && <div className="mute-slash"></div>}
            </button>

            <div className="header-user" ref={dropdownRef}>
              <span className="admin-name">{admin?.name || "관리자"}님</span>
              <button
                className={`arrow-toggle ${isOpen ? "open" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
              />
              {isOpen && (
                <div className="admin-dropdown">
                  <button
                    className="logout-btn"
                    onClick={() => {
                      dispatch(logout());
                      navigate("/login");
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

      <DelayAlertManager isMuted={isMuted} />
    </div>
  );
}
