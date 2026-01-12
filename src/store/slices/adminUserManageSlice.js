import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAdminUsers,
  fetchAdminUserDetail,
} from "../thunks/adminUserManageThunk";

const adminUserManageSlice = createSlice({
  name: "adminUserManage",
  initialState: {
    users: [],
    selectedUser: null,
    totalCount: 0,
    loading: false,
    loadingDetail: false,
    error: null,
    currentPage: 1,
    filters: { userName: "", businessName: "", address: "", sort: "latest" },
  },
  reducers: {
    setUserFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        const result = action.payload.data;
        state.loading = false;
        state.users = result?.items || [];
        state.totalCount = result?.pagination?.totalItems || 0;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 🔍 상세보기 데이터 매핑 확인 로그 추가
      .addCase(fetchAdminUserDetail.pending, (state) => {
        state.loadingDetail = true;
      })
      .addCase(fetchAdminUserDetail.fulfilled, (state, action) => {
        const detailData = action.payload.data;

        // 🚩 콘솔 찍어서 구조 확인
        console.log("💎 [Detail Data Raw]:", detailData);
        if (detailData) {
          console.log("🏢 Businesses Check:", detailData.Businesses);
          console.log("📅 Reservations Check:", detailData.Reservations);
        }

        state.loadingDetail = false;
        state.selectedUser = detailData;
      })
      .addCase(fetchAdminUserDetail.rejected, (state, action) => {
        console.error("❌ Detail Fetch Failed:", action.payload);
        state.loadingDetail = false;
      });
  },
});

export const { setUserFilters, setCurrentPage, clearSelectedUser } =
  adminUserManageSlice.actions;
export default adminUserManageSlice.reducer;
