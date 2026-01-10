import { createAsyncThunk } from "@reduxjs/toolkit";
import { adminReservationApi } from "../../api/adminReservationApi";

export const fetchDashboardStats = createAsyncThunk(
  "adminReservation/fetchStats",
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminReservationApi.getDashboardStats(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "통계 로딩 실패");
    }
  }
);

export const fetchRecentReservations = createAsyncThunk(
  "adminReservation/fetchRecent",
  async (params, { rejectWithValue }) => {
    try {
      console.log("🚀 [Thunk 요청 파라미터]:", params);
      const response = await adminReservationApi.getReservations(params);

      // 🔍 여기서 서버가 주는 원본 데이터를 반드시 확인해야 합니다.
      console.log("📦 [Thunk 서버 응답 원본]:", response.data);

      return response.data;
    } catch (error) {
      console.error("❌ [Thunk 에러]:", error);
      return rejectWithValue(error.response?.data || "데이터 로딩 실패");
    }
  }
);

export const fetchReservationDetail = createAsyncThunk(
  "adminReservation/fetchDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await adminReservationApi.getReservationDetail(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "상세 정보 로딩 실패");
    }
  }
);

export const updateReservationStatusThunk = createAsyncThunk(
  "adminReservation/updateStatus",
  async ({ reservationId, status }, { rejectWithValue }) => {
    try {
      const response = await adminReservationApi.updateReservationStatus(
        reservationId,
        status
      );
      return { reservationId, status, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data || "상태 변경 실패");
    }
  }
);
