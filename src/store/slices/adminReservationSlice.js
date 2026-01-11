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
    delayedReservations: [], // 🚩 지연 의심 레코드 전용 바구니
    selectedReservation: null,
    totalCount: 0,
    loading: false,
    error: null,
    statMode: "today",
    currentPage: 1,
  },
  reducers: {
    clearSelectedReservation: (state) => {
      state.selectedReservation = null;
      state.error = null;
    },
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
      // 2. 예약 목록 조회 시 지연 레코드 자동 추출
      .addCase(fetchRecentReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentReservations.fulfilled, (state, action) => {
        state.loading = false;
        const result = action.payload.data;
        const items = result?.items || [];

        state.recentReservations = items;
        state.totalCount = result?.pagination?.totalItems || 0;

        // 🚩 [핵심 로직] START 상태인데 종료시간이 지난 것들을 지연 바구니에 담기
        const now = new Date();
        state.delayedReservations = items.filter((res) => {
          return res.status === "START" && new Date(res.serviceEndTime) < now;
        });
      })
      .addCase(fetchRecentReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 3. 상세 정보
      .addCase(fetchReservationDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedReservation = action.payload.data;
      });
  },
});

export const { clearSelectedReservation, setDashboardFilter } =
  adminReservationSlice.actions;
export default adminReservationSlice.reducer;
