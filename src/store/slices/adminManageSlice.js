import { createSlice } from "@reduxjs/toolkit";
import { fetchAllReservations } from "../thunks/adminManageThunk.js";

const adminManageSlice = createSlice({
  name: "adminManage",
  initialState: {
    reservations: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {
    resetManageState: (state) => {
      state.reservations = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("⏳ [Slice] 로딩 시작...");
      })
      .addCase(fetchAllReservations.fulfilled, (state, action) => {
        state.loading = false;
        const { items, pagination } = action.payload || {};
        state.reservations = items || [];
        state.pagination = pagination || state.pagination;

        console.log("✨ [Slice] 데이터 저장 완료:", {
          count: state.reservations.length,
          total: state.pagination.totalItems,
        });
      })
      .addCase(fetchAllReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("🚨 [Slice] 에러 상태 업데이트:", action.payload);
      });
  },
});

export const { resetManageState } = adminManageSlice.actions;
export default adminManageSlice.reducer;
