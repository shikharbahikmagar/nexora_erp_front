import { api, getAuthHeaders } from "@/lib/api";
import type {
  ApiResponse,
  CreateEmployeeDocumentPayload,
  EmployeeDocument,
  Paginated,
  UpdateEmployeeDocumentPayload,
} from "./types";

export const fetchEmployeeDocuments = async (
  employeeId: number,
  page = 1,
  perPage = 10,
) => {
  const { data } = await api.get<ApiResponse<Paginated<EmployeeDocument>>>(
    `/employee-documents/${employeeId}`,
    {
      headers: getAuthHeaders(),
      params: { page, per_page: perPage },
    },
  );

  return data;
};

export const fetchEmployeeDocument = async (documentId: number) => {
  const { data } = await api.get<ApiResponse<EmployeeDocument>>(
    `/employee-document/${documentId}`,
    { headers: getAuthHeaders() },
  );

  return data;
};

export const createEmployeeDocument = async (
  employeeId: number,
  payload: CreateEmployeeDocumentPayload,
) => {
  const { data } = await api.post<ApiResponse<EmployeeDocument>>(
    `/employee-document/${employeeId}`,
    payload,
    { headers: getAuthHeaders() },
  );

  return data;
};

export const updateEmployeeDocument = async (
  documentId: number,
  payload: UpdateEmployeeDocumentPayload,
) => {
  const { data } = await api.patch<ApiResponse<EmployeeDocument>>(
    `/employee-document/${documentId}`,
    payload,
    { headers: getAuthHeaders() },
  );

  return data;
};

export const deleteEmployeeDocument = async (documentId: number) => {
  const { data } = await api.delete<ApiResponse<null>>(
    `/employee-document/${documentId}`,
    { headers: getAuthHeaders() },
  );

  return data;
};
