import { api, getAuthHeaders } from "@/lib/api";
import type {
  ApiResponse,
  CreateDepartmentPayload,
  Department,
  Paginated,
  UpdateDepartmentPayload,
} from "./types";

export const fetchDepartments = async (
  companyId: number,
  page = 1,
  perPage = 10,
) => {
  const { data } = await api.get<ApiResponse<Paginated<Department>>>(
    `/departments/${companyId}`,
    {
      headers: getAuthHeaders(),
      params: { page, per_page: perPage },
    },
  );

  return data;
};

export const fetchDepartment = async (departmentId: number) => {
  const { data } = await api.get<ApiResponse<Department>>(
    `/department/${departmentId}`,
    { headers: getAuthHeaders() },
  );

  return data;
};

export const createDepartment = async (payload: CreateDepartmentPayload) => {
  const { data } = await api.post<ApiResponse<Department>>(
    "/departments",
    payload,
    { headers: getAuthHeaders() },
  );

  return data;
};

export const updateDepartment = async (
  departmentId: number,
  payload: UpdateDepartmentPayload,
) => {
  const { data } = await api.patch<ApiResponse<Department>>(
    `/departments/${departmentId}`,
    payload,
    { headers: getAuthHeaders() },
  );

  return data;
};

export const deleteDepartment = async (departmentId: number) => {
  const { data } = await api.delete<ApiResponse<null>>(
    `/departments/${departmentId}`,
    { headers: getAuthHeaders() },
  );

  return data;
};
