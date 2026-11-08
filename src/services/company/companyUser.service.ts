import { api, getAuthHeaders } from "@/lib/api";
import type {
  ApiResponse,
  CompanyUser,
  CreateCompanyUserPayload,
  UpdateCompanyUserPayload,
} from "./types";

export const fetchCompanyUsers = async () => {
  const { data } = await api.get<ApiResponse<CompanyUser[]>>("/company-users", {
    headers: getAuthHeaders(),
  });

  return data;
};

export const fetchCompanyUser = async (companyUserId: number) => {
  const { data } = await api.get<ApiResponse<CompanyUser>>(
    `/company-users/${companyUserId}`,
    { headers: getAuthHeaders() },
  );

  return data;
};

export const createCompanyUser = async (
  companyId: number,
  payload: CreateCompanyUserPayload,
) => {
  const { data } = await api.post<ApiResponse<CompanyUser>>(
    `/company-users/${companyId}`,
    payload,
    { headers: getAuthHeaders() },
  );

  return data;
};

export const updateCompanyUser = async (
  companyUserId: number,
  payload: UpdateCompanyUserPayload,
) => {
  const { data } = await api.patch<ApiResponse<CompanyUser>>(
    `/company-users/${companyUserId}`,
    payload,
    { headers: getAuthHeaders() },
  );

  return data;
};

export const deleteCompanyUser = async (companyUserId: number) => {
  const { data } = await api.delete<ApiResponse<null>>(
    `/company-users/${companyUserId}`,
    { headers: getAuthHeaders() },
  );

  return data;
};
