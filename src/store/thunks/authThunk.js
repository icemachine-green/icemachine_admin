import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

// 관리자 로그인 Thunk
export const adminLoginThunk = createAsyncThunk(
  "auth/adminLogin",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/admin/login", loginData);
      // 서버 응답 구조: { code: "00", msg: "...", data: { accessToken, admin: { ... } } }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "로그인 요청 실패");
    }
  }
);

// 토큰 재발급 Thunk
export const reissueThunk = createAsyncThunk(
  "auth/reissue",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/admin/reissue");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "세션 만료");
    }
  }
);
