import { createSlice } from "@reduxjs/toolkit";
import {
  fetchEngineers,
  updateEngineerStatus,
} from "../thunks/adminEngineerThunk";

const adminEngineerSlice = createSlice({
  name: "adminEngineer",
  initialState: {
    engineers: [],
    totalCount: 0,
    summary: {
      totalEngineers: 0,
      activeEngineers: 0,
      resignedEngineers: 0,
      inactiveEngineers: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearEngineerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEngineers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEngineers.fulfilled, (state, action) => {
        state.loading = false;
        state.engineers = action.payload.items;
        state.totalCount = action.payload.total;
        state.summary = action.payload.summary || state.summary;
      })
      .addCase(fetchEngineers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateEngineerStatus.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export const { clearEngineerError } = adminEngineerSlice.actions;
export default adminEngineerSlice.reducer;
