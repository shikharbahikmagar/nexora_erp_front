import { api, getAuthHeaders } from "@/lib/api";
import type {
  ApiResponse,
  CreateEmployeePayload,
  Employee,
  UpdateEmployeePayload,
} from "./types";

export const fetchEmployees = async (perPage = 100) => {
  const { data } = await api.get<ApiResponse<Employee[]>>("/employees", {
    headers: getAuthHeaders(),
    params: { per_page: perPage },
  });

  return data;
};

export const fetchEmployee = async (employeeId: number) => {
  const { data } = await api.get<ApiResponse<Employee>>(
    `/employees/${employeeId}`,
    { headers: getAuthHeaders() },
  );

  return data;
};

export const createEmployee = async (payload: CreateEmployeePayload) => {
  const { data } = await api.post<ApiResponse<Employee>>("/employees", payload, {
    headers: getAuthHeaders(),
  });

  return data;
};

export const updateEmployee = async (
  employeeId: number,
  payload: UpdateEmployeePayload,
) => {
  const { data } = await api.patch<ApiResponse<Employee>>(
    `/employees/${employeeId}`,
    payload,
    { headers: getAuthHeaders() },
  );

  return data;
};

export const deleteEmployee = async (employeeId: number) => {
  const { data } = await api.delete<ApiResponse<null>>(
    `/employees/${employeeId}`,
    { headers: getAuthHeaders() },
  );

  return data;
};
