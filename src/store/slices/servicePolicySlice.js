import { createSlice } from "@reduxjs/toolkit";
import { fetchServicePolicies } from "../thunks/servicePolicyThunk.js";

const servicePolicySlice = createSlice({
  name: "servicePolicy",
  initialState: {
    policies: [], // "sizeType", "serviceType", "standardDuration", "price", "note"가 포함된 배열
    loading: false,
    error: null,
  },
  reducers: {
    // 필요 시 선택된 정책 초기화 등의 reducer 추가 가능
    clearPolicies: (state) => {
      state.policies = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServicePolicies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServicePolicies.fulfilled, (state, action) => {
        state.loading = false;
        // API 응답 구조가 { code: "00", data: [...] } 이므로 action.payload.data를 저장
        state.policies = action.payload.data || [];
      })
      .addCase(fetchServicePolicies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPolicies } = servicePolicySlice.actions;
export default servicePolicySlice.reducer;
