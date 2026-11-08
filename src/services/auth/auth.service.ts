import { api, getAuthHeaders } from "@/lib/api";
import type { ApiResponse, AuthProfile } from "@/services/employee/types";

export const authLogin = async (credentials: {
  email: string;
  password: string;
}) => {
  const { data } = await api.post("/auth/login", credentials);

  return data;
};

export const authRegiser = async (payload: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}) => {
  const { data } = await api.post("/auth/register", payload);

  return data;
};

export const authMe = async () => {
  const { data } = await api.get<ApiResponse<AuthProfile>>("/auth/me", {
    headers: getAuthHeaders(),
  });

  return data;
};

export const authLogout = async () => {
  const { data } = await api.post<ApiResponse<null>>(
    "/auth/logout",
    {},
    { headers: getAuthHeaders() },
  );

  return data;
};
