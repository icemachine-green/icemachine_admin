import { createAsyncThunk } from "@reduxjs/toolkit";
import { adminEngineerApi } from "../../api/adminEngineerApi";

// 기사 목록 가져오기
export const fetchEngineers = createAsyncThunk(
  "adminEngineer/fetchEngineers",
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminEngineerApi.getEngineers(params);
      return response.data.data; // { items, total, summary }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "기사 목록 로드 실패"
      );
    }
  }
);

// 기사 상태 업데이트
export const updateEngineerStatus = createAsyncThunk(
  "adminEngineer/updateStatus",
  async ({ id, status }, { rejectWithValue, dispatch }) => {
    try {
      await adminEngineerApi.updateStatus(id, status);
      // 업데이트 후 목록을 다시 불러와서 최신화
      dispatch(fetchEngineers({ page: 1, limit: 10 }));
      return { id, status };
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || "상태 변경 실패");
    }
  }
);
