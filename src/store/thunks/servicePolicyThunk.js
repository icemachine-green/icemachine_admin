import { createAsyncThunk } from "@reduxjs/toolkit";
import { servicePolicyApi } from "../../api/servicePolicyApi";

export const fetchServicePolicies = createAsyncThunk(
  "servicePolicy/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await servicePolicyApi.getAllPolicies();
      return response.data; // API 반환값의 data 배열
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || "정책 로딩 실패");
    }
  }
);
