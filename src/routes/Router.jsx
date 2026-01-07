import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import App from "../App.jsx";
import MainLayout from "../components/layouts/MainLayout.jsx";
import ProtectedRoute from "../components/auth/ProtectedRoute.jsx"; // 가드 컴포넌트 추가 필요

import DashboardPage from "../pages/DashboardPage.jsx";
import ServicePolicyPage from "../pages/ServicePolicyPage.jsx";
import ReservationManagePage from "../pages/ReservationManagePage.jsx";
import DriverManagePage from "../pages/DriverManagePage.jsx";
import CustomerManagePage from "../pages/CustomerManagePage.jsx";
import AdminAccountPage from "../pages/AdminAccountPage.jsx";
import AdminLoginPage from "../pages/AdminLoginPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      /* 🔓 공개 라우트 (누구나 접근 가능) */
      {
        path: "ice-mgnt-505",
        element: <AdminLoginPage />,
      },

      /* 🔐 보호된 라우트 (로그인 필수) */
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <MainLayout />,
            children: [
              {
                index: true,
                element: <DashboardPage />,
              },
              {
                path: "service",
                element: <ServicePolicyPage />,
              },
              {
                path: "reservation",
                element: <ReservationManagePage />,
              },
              {
                path: "driver",
                element: <DriverManagePage />,
              },
              {
                path: "customer",
                element: <CustomerManagePage />,
              },
              {
                path: "admin",
                element: <AdminAccountPage />,
              },
            ],
          },
        ],
      },

      /* ❓ 정의되지 않은 경로는 로그인으로 리다이렉트 */
      {
        path: "*",
        element: <Navigate to="/ice-mgnt-505" replace />,
      },
    ],
  },
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
