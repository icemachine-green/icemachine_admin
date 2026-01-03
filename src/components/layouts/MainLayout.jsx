import { Outlet } from "react-router-dom";
import "./MainLayout.css";

export default function MainLayout() {
  return (
    <main className="main-layout">
      {/* 상단 헤더 */}
      <header className="header">
        {/* 왼쪽 영역 */}
        <div className="header-left">
          <h1>대시보드</h1>
        </div>

        {/* 오른쪽 영역 */}
        <div className="header-right">
          <img className="header-icon" src="/icons/jong_icon.png" alt="종아이콘" />
          <img className="header-icon" src="/icons/memo_icon.png" alt="메모아이콘" />

          <div className="header-user">
            <img className="admin-icon" src="/icons/admin_icon.png" alt="관리자로그인아이콘" />
            <span className="admin-name">admin 계정관리자</span>
          </div>
        </div>
      </header>

      {/* 하위 콘텐츠 */}
      <section className="content">
        <Outlet />
      </section>
    </main>
  );
}

 