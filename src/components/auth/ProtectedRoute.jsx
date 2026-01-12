// src/components/auth/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const { isLoggedIn, isInitializing } = useSelector((state) => state.auth);
  const location = useLocation();

  // 1. 초기화 중이거나 재발급 로직이 동작 중일 때는 무조건 로딩 대기
  if (isInitializing) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        인증 확인 중...
      </div>
    );
  }

  // 2. 로그인 상태가 아닐 때의 처리
  if (!isLoggedIn) {
    // [중요] 여기에 도달했다면 정말로 토큰이 없는 것인지,
    // 아니면 잠깐 상태가 꼬인 것인지 확인하기 위해 로컬 스토리지 등에 기록된
    // '로그인 시도 흔적' 등을 체크하는 로직을 보강할 수 있습니다.
    return <Navigate to="/ice-mgnt-505" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
