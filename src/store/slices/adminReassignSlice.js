import { createSlice } from "@reduxjs/toolkit";
import {
  fetchRecommendedEngineers,
  assignEngineer,
} from "../thunks/adminReassignThunk";

const adminReassignSlice = createSlice({
  name: "adminReassign",
  initialState: {
    recommendedEngineers: [],
    loading: false,
    assignLoading: false,
    error: null,
  },
  reducers: {
    resetReassignState: (state) => {
      state.recommendedEngineers = [];
      state.loading = false;
      state.assignLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendedEngineers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecommendedEngineers.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendedEngineers = action.payload; // 기사 배열 저장
      })
      .addCase(fetchRecommendedEngineers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(assignEngineer.pending, (state) => {
        state.assignLoading = true;
        state.error = null;
      })
      .addCase(assignEngineer.fulfilled, (state) => {
        state.assignLoading = false;
      })
      .addCase(assignEngineer.rejected, (state, action) => {
        state.assignLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetReassignState } = adminReassignSlice.actions;
export default adminReassignSlice.reducer;
