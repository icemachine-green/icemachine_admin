import { createAsyncThunk } from "@reduxjs/toolkit";
import { adminReservationApi } from "../../api/adminReservationApi.js";

export const fetchAllReservations = createAsyncThunk(
  "adminManage/fetchAll",
  async ({ page, limit, sortBy, orderBy }, { rejectWithValue }) => {
    try {
      // 1. API 호출 시 인자 그대로 전달 (page, limit, sortBy, orderBy)
      const response = await adminReservationApi.getReservations({
        page,
        limit,
        sortBy,
        orderBy,
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "서버 통신 에러");
    }
  }
);
