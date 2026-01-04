import './App.css';
import SideBar from "./components/sidebar/SideBar.jsx";
import { Outlet, useLocation } from "react-router-dom";

function App() {
  // 현재 라우터의 경로(path)를 가져오기 위한 훅
  const { pathname } = useLocation();

  // 관리자 로그인 페이지 여부 체크
  // 해당 페이지에서는 Sidebar를 숨기기 위함
  const isLoginPage = pathname === "/adminloginstart";

  return (
    <div className="App">
      {/* 
        로그인 페이지가 아닐 때만 사이드바 출력
        (관리자 내부 페이지 전용 레이아웃)
      */}
      {!isLoginPage && <SideBar />}

      {/* 
        각 라우트별 페이지가 렌더링되는 영역
        MainLayout 또는 단독 페이지가 이 위치에 출력됨
      */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
