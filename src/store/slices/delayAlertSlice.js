import { createSlice } from "@reduxjs/toolkit";
import { fetchDelayMonitorData } from "../thunks/delayAlertThunk";
import dayjs from "dayjs";

const delayAlertSlice = createSlice({
  name: "delayAlert",
  initialState: {
    delayData: [],
    delayedItems: [], // 🚩 헤더 숫자에 반영될 바구니
    loading: false,
    error: null,
  },
  reducers: {
    clearDelayAlert: (state) => {
      state.delayedItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDelayMonitorData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDelayMonitorData.fulfilled, (state, action) => {
        state.loading = false;
        const result = action.payload.data;
        const items = result?.items || [];
        state.delayData = items;

        // 🚩 [DelayedReservationPage 로직 그대로 이식]
        const currentNow = dayjs();
        state.delayedItems = items.filter((row) => {
          // 1. 상태가 CONFIRMED여야 함
          if (row.status !== "CONFIRMED") return false;

          // 2. 시작 시간 + 10분 유예 로직
          const gracePeriodThreshold = dayjs(row.serviceStartTime).add(
            10,
            "minute"
          );

          // 현재 시간이 유예 시간을 지났다면 true (지연)
          return currentNow.isAfter(gracePeriodThreshold);
        });

        state.error = null;
      })
      .addCase(fetchDelayMonitorData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDelayAlert } = delayAlertSlice.actions;
export default delayAlertSlice.reducer;
