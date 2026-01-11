import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import SideBar from "../sidebar/SideBar";
import "./MainLayout.css";

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { admin } = useSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 페이지 제목 설정
  const TITLE_MAP = {
    "/": "대시보드",
    "/service": "서비스 정책",
    "/reservation": "예약 관리",
    "/driver": "기사 관리",
    "/customer": "고객 관리",
    "/admin": "관리자 계정 관리",
  };
  const title = TITLE_MAP[location.pathname] || "대시보드";

  // 드롭다운 외부 클릭 감지
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
    </div>
  );
}
