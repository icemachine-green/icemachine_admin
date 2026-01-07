import { createSlice } from "@reduxjs/toolkit";
import {
  fetchDashboardStats,
  fetchRecentReservations,
  fetchReservationDetail, // Thunk 추가
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
    selectedReservation: null, // [추가] 상세 보기 데이터 저장용
    totalCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // [추가] 모달을 닫을 때 상세 데이터를 비워주는 액션
    clearSelectedReservation: (state) => {
      state.selectedReservation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 기존 통계 로직
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data || state.stats;
      })
      // 기존 리스트 로직
      .addCase(fetchRecentReservations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecentReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.recentReservations = action.payload?.items || [];
        state.totalCount = action.payload?.pagination?.totalItems || 0;
      })
      .addCase(fetchRecentReservations.rejected, (state, action) => {
        state.loading = false;
        state.recentReservations = [];
        state.totalCount = 0;
        state.error = action.payload;
      })

      // [추가] 상세 정보 로직 (기존 로직에 영향 없음)
      .addCase(fetchReservationDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReservationDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedReservation = action.payload; // 단일 데이터 객체 저장
      })
      .addCase(fetchReservationDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedReservation } = adminReservationSlice.actions;
export default adminReservationSlice.reducer;
