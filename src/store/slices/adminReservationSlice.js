import { createSlice } from "@reduxjs/toolkit";
import {
  fetchDashboardStats,
  fetchRecentReservations,
} from "../thunks/adminReservationThunk";

const adminReservationSlice = createSlice({
  name: "adminReservation",
  initialState: {
    stats: {
      PENDING: 0,
      CONFIRMED: 0,
      START: 0,
      COMPLETED: 0,
      CANCELED: 0,
      TOTAL: 0,
    },
    recentReservations: [],
    totalCount: 0,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data || state.stats;
      })
      .addCase(fetchRecentReservations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecentReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.recentReservations = action.payload?.items || [];
        // [수정] 백엔드 로그 확인 결과 totalItems가 전체 개수임
        state.totalCount = action.payload?.pagination?.totalItems || 0;
      })
      .addCase(fetchRecentReservations.rejected, (state, action) => {
        state.loading = false;
        state.recentReservations = [];
        state.totalCount = 0;
        state.error = action.payload;
      });
  },
});

export default adminReservationSlice.reducer;
