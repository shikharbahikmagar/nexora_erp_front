import { api, getAuthHeaders } from "@/lib/api";
import type {
  AssignRolePayload,
  AuthProfile,
} from "@/services/employee/types";

export const assignUserRole = async (
  userId: number,
  payload: AssignRolePayload,
) => {
  const { data } = await api.post<{ message: string; data: AuthProfile }>(
    `/users/${userId}/role`,
    payload,
    { headers: getAuthHeaders() },
  );

  return data;
};
