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
    error: null,
    currentPage: 1,
    filters: { userName: "", businessName: "", address: "" },
  },
  reducers: {
    setUserFilters: (state, action) => {
      console.log("🔍 [Slice] Filter Updated:", action.payload);
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      console.log("📑 [Slice] Page Switched to:", action.payload);
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        const result = action.payload.data;
        // 📦 3. 실제로 리스트에 들어갈 데이터 개수와 전체 개수 확인
        console.log(
          "📦 [Slice] Store Update -> Items:",
          result?.items?.length,
          "/ Total:",
          result?.pagination?.totalItems
        );

        state.loading = false;
        state.users = result?.items || [];
        state.totalCount = result?.pagination?.totalItems || 0;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        console.log("⚠️ [Slice] Fetch Failed:", action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUserFilters, setCurrentPage } = adminUserManageSlice.actions;
export default adminUserManageSlice.reducer;
