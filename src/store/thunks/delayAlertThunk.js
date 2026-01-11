import { createAsyncThunk } from "@reduxjs/toolkit";
import { adminReservationApi } from "../../api/adminReservationApi";

export const fetchDelayMonitorData = createAsyncThunk(
  "delayAlert/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      // DelayedReservationPage와 동일한 파라미터 조건으로 호출
      const params = {
        page: 1,
        limit: 200,
        orderBy: "serviceStartTime",
        sortBy: "ASC",
        status: "CONFIRMED", // 🚩 핵심: 확정 상태인 것들을 가져옴
      };
      const response = await adminReservationApi.getReservations(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "데이터 로딩 실패");
    }
  }
);
