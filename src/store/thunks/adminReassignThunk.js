import { createAsyncThunk } from "@reduxjs/toolkit";
import { adminReassignApi } from "../../api/adminReassignApi";

export const fetchRecommendedEngineers = createAsyncThunk(
  "adminReassign/fetchRecommendedEngineers",
  async (reservationId, { rejectWithValue }) => {
    try {
      const response = await adminReassignApi.getRecommendedEngineers(
        reservationId
      );
      // 보내주신 JSON 구조상 response.data.data가 배열입니다.
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "추천 리스트 조회 실패"
      );
    }
  }
);

export const assignEngineer = createAsyncThunk(
  "adminReassign/assignEngineer",
  async ({ reservationId, engineerId }, { rejectWithValue }) => {
    try {
      const response = await adminReassignApi.assignEngineer(
        reservationId,
        engineerId
      );
      console.log("✅ [Thunk] 재배정 성공 응답:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [Thunk] 재배정 에러 상세:", error.response);
      return rejectWithValue(error.response?.data?.msg || "기사 재배정 실패");
    }
  }
);
