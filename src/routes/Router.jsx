import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App.jsx";
import MainLayout from "../components/layouts/MainLayout.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";

const router = createBrowserRouter([
  {
    element: <App />,   // 좌측 사이드바 + main 자리
    children: [
      {
        element: <MainLayout />, // 여기서 Header + Outlet 구조
        children: [
          {
            path: "/",            // 루트 경로
            element: <DashboardPage /> // Header 밑에 렌더링될 페이지
          },
          // 앞으로 다른 페이지가 추가되면 이 배열에 추가합니다.
          // 예: { path: '/login', element: <LoginPage /> }
        ]
      }
    ]
  }
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
