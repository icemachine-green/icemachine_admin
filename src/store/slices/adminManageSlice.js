import { createSlice } from "@reduxjs/toolkit";
import {
  fetchDashboardStats,
  fetchRecentReservations,
  fetchReservationDetail,
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
    selectedReservation: null,
    totalCount: 0,
    loading: false,
    error: null,
    // 🚩 페이지 유지용 상태 추가
    statMode: "today",
    currentPage: 1,
  },
  reducers: {
    clearSelectedReservation: (state) => {
      state.selectedReservation = null;
      state.error = null;
    },
    // 🚩 필터 및 페이지 상태 업데이트 액션
    setDashboardFilter: (state, action) => {
      const { mode, page } = action.payload;
      if (mode !== undefined) state.statMode = mode;
      if (page !== undefined) state.currentPage = page;
    },
  },
  extraReducers: (builder) => {
    builder
      // 1. 대시보드 통계
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data || state.stats;
      })
      // 2. 예약 목록
      .addCase(fetchRecentReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentReservations.fulfilled, (state, action) => {
        state.loading = false;
        const result = action.payload.data;

        state.recentReservations = result?.items || [];
        state.totalCount = result?.pagination?.totalItems || 0;
      })
      .addCase(fetchRecentReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 3. 상세 정보
      .addCase(fetchReservationDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservationDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedReservation = action.payload.data;
      })
      .addCase(fetchReservationDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.selectedReservation = null;
      });
  },
});

export const { clearSelectedReservation, setDashboardFilter } =
  adminReservationSlice.actions;
export default adminReservationSlice.reducer;
