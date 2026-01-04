import { Outlet, useLocation } from "react-router-dom";
import "./MainLayout.css";

export default function MainLayout() {
  const location = useLocation();

  const TITLE_MAP = {
    "/": "대시보드",
    "/service": "서비스 정책",
    "/reservation": "예약 관리",
    "/driver": "기사 관리",
    "/customer": "고객 관리",
    "/admin": "관리자 계정 관리",
  };

  const title = TITLE_MAP[location.pathname] || "대시보드";

  return (
    <main className="main-layout">
      {/* 상단 헤더 */}
      <header className="header">
        <div className="header-left">
          <h1>{title}</h1>
        </div>

        <div className="header-right">
          <img className="header-icon" src="/icons/jong_icon.png" alt="종아이콘" />
          <img className="header-icon" src="/icons/memo_icon.png" alt="메모아이콘" />

          <div className="header-user">
            <img className="admin-icon" src="/icons/admin_icon.png" alt="관리자로그인아이콘" />
            <span className="admin-name">admin 계정관리자</span>
          </div>
        </div>
      </header>

      <section className="content">
        <Outlet />
      </section>
    </main>
  );
}

 