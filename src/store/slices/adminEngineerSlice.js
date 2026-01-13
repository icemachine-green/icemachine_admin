/**
 * @file store/slices/adminEngineerSlice.js
 * @description 기사 관리 상태 관리 슬라이스
 */
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
    // 에러 상태 초기화가 필요할 때 사용
    clearEngineerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 1. 기사 목록 로드
      .addCase(fetchEngineers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEngineers.fulfilled, (state, action) => {
        state.loading = false;

        // 백엔드 응답 구조(data.data)에 맞춘 데이터 매핑
        // items: 기사 목록 배열
        // pagination.totalItems: 전체 기사 수 (48명)
        state.engineers = action.payload?.items || [];
        state.totalCount = action.payload?.pagination?.totalItems || 0;
        state.summary = action.payload?.summary || state.summary;

        // 디버깅 확인용 로그
        console.log("기사 데이터 로드 완료 - 총 명수:", state.totalCount);
      })
      .addCase(fetchEngineers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "데이터를 불러오는 중 오류가 발생했습니다.";
      })

      // 2. 기사 상태 업데이트
      .addCase(updateEngineerStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEngineerStatus.fulfilled, (state) => {
        state.loading = false;
        // 상세 상태 변경 로직은 thunk 내 fetchEngineers 재호출로 처리됨
      })
      .addCase(updateEngineerStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEngineerError } = adminEngineerSlice.actions;
export default adminEngineerSlice.reducer;
