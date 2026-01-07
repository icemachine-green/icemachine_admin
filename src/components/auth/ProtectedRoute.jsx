// src/components/auth/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { isLoggedIn, isInitializing } = useSelector((state) => state.auth);

  // 앱이 새로고침되어 토큰을 재발급(reissue) 받는 중이라면 로딩 화면을 보여줌.
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

  // 로그인 상태가 아니라면 로그인 페이지로 리다이렉트
  if (!isLoggedIn) {
    return <Navigate to="/ice-mgnt-505" replace />;
  }

  // 로그인 상태라면 자식 라우트(MainLayout)를 보여줌.
  return <Outlet />;
}
