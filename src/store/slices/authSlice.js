import { createSlice } from "@reduxjs/toolkit";
import { adminLoginThunk, reissueThunk } from "../thunks/authThunk.js";

const initialState = {
  isLoggedIn: false,
  isInitializing: true, // 초기값 true (ProtectedRoute가 로딩창을 띄우는 기준)
  admin: null,
  accessToken: null,
  role: null,
  isSuperAdmin: false,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      // 로그아웃 시 초기 상태로 되돌리되, 초기화 로딩은 끝난 상태로 설정
      Object.assign(state, initialState);
      state.isInitializing = false;
    },
    clearAuthState: (state) => {
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // 1. 로그인 처리
      .addCase(adminLoginThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(adminLoginThunk.fulfilled, (state, action) => {
        const { accessToken, admin } = action.payload.data;
        state.status = "succeeded";
        state.isLoggedIn = true;
        state.accessToken = accessToken;
        state.admin = admin;
        state.role = admin?.role;
        state.isSuperAdmin = admin?.role === "SUPER_ADMIN";
        state.isInitializing = false; // 로그인 성공 시 로딩 해제
      })
      .addCase(adminLoginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.isInitializing = false; // 로그인 실패 시 로딩 해제
      })

      // 2. 토큰 재발급 처리 (새로고침 시 로그인 유지 로직)
      .addCase(reissueThunk.pending, (state) => {
        state.isInitializing = true;
      })
      .addCase(reissueThunk.fulfilled, (state, action) => {
        const { accessToken, admin } = action.payload.data;
        state.isInitializing = false; // 로딩 완료
        state.isLoggedIn = true;
        state.accessToken = accessToken;
        state.admin = admin;
        state.role = admin?.role;
        state.isSuperAdmin = admin?.role === "SUPER_ADMIN";
      })
      .addCase(reissueThunk.rejected, (state) => {
        state.isInitializing = false; // 실패해도 로딩은 꺼줘야 ProtectedRoute가 로그인 페이지로 보냄
        state.isLoggedIn = false;
        state.accessToken = null;
        state.admin = null;
        state.role = null;
        state.isSuperAdmin = false;
      });
  },
});

export const { logout, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
