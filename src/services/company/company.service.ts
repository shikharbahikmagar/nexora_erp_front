import { api, getAuthHeaders } from "@/lib/api";
import type {
  ApiResponse,
  Company,
  CompanyDetail,
  CreateCompanyPayload,
  Paginated,
  UpdateCompanyPayload,
} from "./types";

export const fetchCompanies = async (page = 1, perPage = 10) => {
  const { data } = await api.get<ApiResponse<Paginated<Company>>>("/get-company", {
    headers: getAuthHeaders(),
    params: { page, per_page: perPage },
  });

  return data;
};

export const fetchCompany = async (companyId: number) => {
  const { data } = await api.get<ApiResponse<CompanyDetail>>(
    `/company/${companyId}`,
    { headers: getAuthHeaders() },
  );

  return data;
};

export const fetchMyCompany = async () => {
  const { data } = await api.get<ApiResponse<CompanyDetail>>("/my-company", {
    headers: getAuthHeaders(),
  });

  return data;
};

export const createCompany = async (payload: CreateCompanyPayload) => {
  const { data } = await api.post<ApiResponse<Company>>(
    "/create-company",
    payload,
    { headers: getAuthHeaders() },
  );

  return data;
};

export const updateCompany = async (
  companyId: number,
  payload: UpdateCompanyPayload,
) => {
  const { data } = await api.patch<ApiResponse<Company>>(
    `/update-company/${companyId}`,
    payload,
    { headers: getAuthHeaders() },
  );

  return data;
};

export const deleteCompany = async (companyId: number) => {
  const { data } = await api.delete<ApiResponse<null>>(
    `/delete-company/${companyId}`,
    { headers: getAuthHeaders() },
  );

  return data;
};
