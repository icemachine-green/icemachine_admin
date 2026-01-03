import { useNavigate } from "react-router-dom";
import "./SideBar.css";

export default function SideBar() {
  const navigate = useNavigate();

  return (
    <aside className="sidebar-container">
      <h1 className="sidebar-title">서비스 운영 관리</h1>

      <nav className="sidebar-menu">
        <div className="menu-item" onClick={() => navigate("/")}>
          대시보드
        </div>

        <div className="menu-item" onClick={() => navigate("/service")}>
          서비스 정책
        </div>

        <div className="menu-item" onClick={() => navigate("/reservation")}>
          예약 관리
        </div>

        <div className="menu-item" onClick={() => navigate("/driver")}>
          기사 관리
        </div>

        <div className="menu-item" onClick={() => navigate("/customer")}>
          고객 관리
        </div>

        <div className="menu-item" onClick={() => navigate("/admin")}>
          관리자 계정 관리
        </div>
      </nav>
    </aside>
  );
}
