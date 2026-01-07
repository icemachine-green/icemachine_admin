import { createAsyncThunk } from "@reduxjs/toolkit";
import { adminReservationApi } from "../../api/adminReservationApi";

export const fetchDashboardStats = createAsyncThunk(
  "adminReservation/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminReservationApi.getDashboardStats();
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
      const response = await adminReservationApi.getReservations(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "데이터 로딩 실패");
    }
  }
);

// [추가] 단일 예약 상세 정보 조회
export const fetchReservationDetail = createAsyncThunk(
  "adminReservation/fetchDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await adminReservationApi.getReservationDetail(id);
      // 백엔드 응답의 data.data 구조를 반환 (User, Business, Engineer 등 포함)
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "상세 정보 로딩 실패");
    }
  }
);
