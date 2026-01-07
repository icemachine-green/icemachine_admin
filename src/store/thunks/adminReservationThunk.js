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
      // params = { page, limit, orderBy: 'reservedDate', sortBy: 'DESC' }
      const response = await adminReservationApi.getReservations(params);
      return response.data.data; // items와 pagination이 모두 포함된 객체
    } catch (error) {
      return rejectWithValue(error.response?.data || "데이터 로딩 실패");
    }
  }
);
