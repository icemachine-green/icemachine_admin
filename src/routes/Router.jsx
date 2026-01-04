import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App.jsx";
import MainLayout from "../components/layouts/MainLayout.jsx";

import DashboardPage from "../pages/DashboardPage.jsx";
import ServicePolicyPage from "../pages/ServicePolicyPage.jsx";
import ReservationManagePage from "../pages/ReservationManagePage.jsx";
import DriverManagePage from "../pages/DriverManagePage.jsx";
import CustomerManagePage from "../pages/CustomerManagePage.jsx";
import AdminAccountPage from "../pages/AdminAccountPage.jsx";
import AdminLoginPage from "../pages/AdminLoginPage.jsx";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [

      /* 🔐 로그인 페이지 (레이아웃 없음) */
      {
        path: "/adminloginstart",
        element: <AdminLoginPage />
      },

      /* 🧱 관리자 내부 페이지 (Header + Sidebar 포함) */
      {
        element: <MainLayout />,
        children: [
          {
            path: "/",
            element: <DashboardPage />
          },
          {
            path: "/service",
            element: <ServicePolicyPage />
          },
          {
            path: "/reservation",
            element: <ReservationManagePage />
          },
          {
            path: "/driver",
            element: <DriverManagePage />
          },
          {
            path: "/customer",
            element: <CustomerManagePage />
          },
          {
            path: "/admin",
            element: <AdminAccountPage />
          }
        ]
      }
    ]
  }
]);

const Router = () => <RouterProvider router={router} />;

export default Router;

