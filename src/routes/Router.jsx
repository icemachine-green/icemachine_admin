import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App.jsx";
import MainLayout from "../components/layouts/MainLayout.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import ServicePolicyPage from "../pages/ServicePolicyPage.jsx";
import ReservationManagePage from "../pages/ReservationManagePage.jsx";
import DriverManagePage from "../pages/DriverManagePage.jsx";
import CustomerManagePage from "../pages/CustomerManagePage.jsx";
import AdminAccountPage from "../pages/AdminAccountPage.jsx";

const router = createBrowserRouter([
  {
    element: <App />,  
    children: [
      {
        element: <MainLayout />, // 여기서 Header + Outlet 구조
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
