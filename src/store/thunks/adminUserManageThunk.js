import { createAsyncThunk } from "@reduxjs/toolkit";
import { adminUserManageApi } from "../../api/adminUserManageApi";

export const fetchAdminUsers = createAsyncThunk(
  "adminUserManage/fetchUsers",
  async (params, { rejectWithValue }) => {
    try {
      // 🚀 1. 어떤 파라미터(page, limit 등)로 요청했는지 확인
      console.log("🚀 [Thunk] Request Params:", params);

      const response = await adminUserManageApi.getUsers(params);

      // ✅ 2. 서버에서 실제 준 데이터 구조 확인
      console.log("✅ [Thunk] Response Data:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [Thunk] Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "고객 목록 로딩 실패");
    }
  }
);

export const fetchAdminUserDetail = createAsyncThunk(
  "adminUserManage/fetchUserDetail",
  async (id, { rejectWithValue }) => {
    try {
      console.log("🚀 [Thunk] Detail Request ID:", id);
      const response = await adminUserManageApi.getUserDetail(id);
      console.log("✅ [Thunk] Detail Response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "상세 정보 로딩 실패");
    }
  }
);
