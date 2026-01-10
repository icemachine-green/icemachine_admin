import { createAsyncThunk } from "@reduxjs/toolkit";
import { adminReservationApi } from "../../api/adminReservationApi";

/**
 * 1. 대시보드 통계 조회
 */
export const fetchDashboardStats = createAsyncThunk(
  "adminReservation/fetchStats",
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminReservationApi.getDashboardStats(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "통계 로딩 실패");
    }
  }
);

/**
 * 2. 예약 목록 조회 (검색 및 필터링 포함)
 * - params에 totalSearch(고객/매장/기사명) 또는 reservationId가 포함되어 전달됩니다.
 */
export const fetchRecentReservations = createAsyncThunk(
  "adminReservation/fetchRecent",
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminReservationApi.getReservations(params);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "데이터 로딩 실패");
    }
  }
);

/**
 * 3. 예약 상세 정보 조회
 */
export const fetchReservationDetail = createAsyncThunk(
  "adminReservation/fetchDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await adminReservationApi.getReservationDetail(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "상세 정보 로딩 실패");
    }
  }
);

/**
 * 4. 예약 상태 변경
 * - 상태 변경 성공 후 리스트를 새로고침하는 로직은 컴포넌트(Page) 레이어에서 처리합니다.
 */
export const updateReservationStatusThunk = createAsyncThunk(
  "adminReservation/updateStatus",
  async ({ reservationId, status }, { rejectWithValue }) => {
    try {
      const response = await adminReservationApi.updateReservationStatus(
        reservationId,
        status
      );

      // 상태 변경 성공 시 변경된 정보와 서버 메시지 반환
      return {
        reservationId,
        status,
        message: response.data?.message || "상태가 성공적으로 변경되었습니다.",
      };
    } catch (error) {
      // 401 권한 에러 등 예외 처리
      const errorMessage = error.response?.data?.message || "상태 변경 실패";
      return rejectWithValue(errorMessage);
    }
  }
);
