import { api, getAuthHeaders } from "@/lib/api";
import type {
  ApiResponse,
  Attendance,
  CreateAttendancePayload,
  Paginated,
  UpdateAttendancePayload,
} from "./types";

export const fetchAttendances = async (page = 1, perPage = 10) => {
  const { data } = await api.get<ApiResponse<Paginated<Attendance>>>(
    "/attendances",
    {
      headers: getAuthHeaders(),
      params: { page, per_page: perPage },
    },
  );

  return data;
};

export const fetchAttendance = async (attendanceId: number) => {
  const { data } = await api.get<ApiResponse<Attendance>>(
    `/attendances/${attendanceId}`,
    { headers: getAuthHeaders() },
  );

  return data;
};

export const createAttendance = async (payload: CreateAttendancePayload) => {
  const { data } = await api.post<ApiResponse<Attendance>>(
    "/attendances",
    payload,
    { headers: getAuthHeaders() },
  );

  return data;
};

export const updateAttendance = async (
  attendanceId: number,
  payload: UpdateAttendancePayload,
) => {
  const { data } = await api.patch<ApiResponse<Attendance>>(
    `/attendances/${attendanceId}`,
    payload,
    { headers: getAuthHeaders() },
  );

  return data;
};

export const deleteAttendance = async (attendanceId: number) => {
  const { data } = await api.delete<ApiResponse<null>>(
    `/attendances/${attendanceId}`,
    { headers: getAuthHeaders() },
  );

  return data;
};
