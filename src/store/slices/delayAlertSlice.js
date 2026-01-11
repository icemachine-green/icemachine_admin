import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🚩 지연 감시 전용 텅크 (기존 API를 쓰되 저장소만 다름)
export const fetchDelayMonitorData = createAsyncThunk(
  "delayAlert/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "/api/admin/reservations/recent?page=1&size=200"
      );
      return response.data.data; // 200개 데이터 반환
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const delayAlertSlice = createSlice({
  name: "delayAlert",
  initialState: {
    delayData: [], // 🚩 대시보드 테이블과는 완전히 별개의 주머니!
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDelayMonitorData.fulfilled, (state, action) => {
      state.delayData = action.payload;
      state.loading = false;
    });
  },
});

export default delayAlertSlice.reducer;
