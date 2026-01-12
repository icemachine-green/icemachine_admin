import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
// 관리자 예약 리듀서 추가
import adminReservationReducer from "./slices/adminReservationSlice.js";
import adminManageReducer from "./slices/adminManageSlice.js";
import delayAlertReducer from "./slices/delayAlertSlice.js"; // 🚩 새로 만든 리듀서
import adminReassignReducer from "./slices/adminReassignSlice";
import servicePolicyReducer from "./slices/servicePolicySlice.js";
import { injectStoreInAxios } from "../api/axiosInstance.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // 키 이름을 컴포넌트 useSelector에서 사용할 이름과 맞춰줍니다.
    adminReservation: adminReservationReducer,
    adminManage: adminManageReducer,
    delayAlert: delayAlertReducer,
    adminReassign: adminReassignReducer,
    servicePolicy: servicePolicyReducer,
  },
});

// Axios 인터셉터에 스토어 주입 (재발급 로직용)
injectStoreInAxios(store);
