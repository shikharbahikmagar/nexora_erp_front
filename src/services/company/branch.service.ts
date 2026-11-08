import { api, getAuthHeaders } from "@/lib/api";
import type {
  ApiResponse,
  Branch,
  CreateBranchPayload,
  Paginated,
  UpdateBranchPayload,
} from "./types";

export const fetchBranches = async (
  companyId: number,
  page = 1,
  perPage = 10,
) => {
  const { data } = await api.get<ApiResponse<Paginated<Branch>>>(
    `/get-branches/${companyId}`,
    {
      headers: getAuthHeaders(),
      params: { page, per_page: perPage },
    },
  );

  return data;
};

export const fetchBranch = async (branchId: number) => {
  const { data } = await api.get<ApiResponse<Branch>>(`/branch/${branchId}`, {
    headers: getAuthHeaders(),
  });

  return data;
};

export const createBranch = async (payload: CreateBranchPayload) => {
  const { data } = await api.post<ApiResponse<Branch>>(
    "/create-branch",
    payload,
    { headers: getAuthHeaders() },
  );

  return data;
};

export const updateBranch = async (
  branchId: number,
  payload: UpdateBranchPayload,
) => {
  const { data } = await api.patch<ApiResponse<Branch>>(
    `/update-branch/${branchId}`,
    payload,
    { headers: getAuthHeaders() },
  );

  return data;
};

export const deleteBranch = async (branchId: number) => {
  const { data } = await api.delete<ApiResponse<null>>(
    `/delete-branch/${branchId}`,
    { headers: getAuthHeaders() },
  );

  return data;
};
