import { api, getAuthHeaders } from "@/lib/api";
import type {
  ApiResponse,
  CreateEmployeeContractPayload,
  EmployeeContract,
  Paginated,
  UpdateEmployeeContractPayload,
} from "./types";

export const fetchEmployeeContracts = async (
  employeeId: number,
  page = 1,
  perPage = 10,
) => {
  const { data } = await api.get<ApiResponse<Paginated<EmployeeContract>>>(
    `/employee-contracts/${employeeId}`,
    {
      headers: getAuthHeaders(),
      params: { page, per_page: perPage },
    },
  );

  return data;
};

export const fetchEmployeeContract = async (contractId: number) => {
  const { data } = await api.get<ApiResponse<EmployeeContract>>(
    `/employee-contract/${contractId}`,
    { headers: getAuthHeaders() },
  );

  return data;
};

export const createEmployeeContract = async (
  employeeId: number,
  payload: CreateEmployeeContractPayload,
) => {
  const { data } = await api.post<ApiResponse<EmployeeContract>>(
    `/employee-contract/${employeeId}`,
    payload,
    { headers: getAuthHeaders() },
  );

  return data;
};

export const updateEmployeeContract = async (
  contractId: number,
  payload: UpdateEmployeeContractPayload,
) => {
  const { data } = await api.patch<ApiResponse<EmployeeContract>>(
    `/employee-contract/${contractId}`,
    payload,
    { headers: getAuthHeaders() },
  );

  return data;
};

export const deleteEmployeeContract = async (contractId: number) => {
  const { data } = await api.delete<ApiResponse<null>>(
    `/employee-contract/${contractId}`,
    { headers: getAuthHeaders() },
  );

  return data;
};
