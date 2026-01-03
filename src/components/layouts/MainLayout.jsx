import { Outlet } from "react-router-dom";
import './MainLayout.css';

export default function MainLayout() {
  return (
    <main className="main-layout">
      {/* 상단 헤더 */}
      <header className="header">
        <h1>헤더 영역 입니다</h1>
        {/* 여기 나중에 유저 프로필, 메뉴 버튼 등 추가 가능 */}
      </header>

      {/* 하위 콘텐츠 영역 */}
      <section className="content">
        <Outlet />  {/* Outlet이 실제 페이지(DashboardPage 등) 자리 */}
      </section>
    </main>
  );
}
 