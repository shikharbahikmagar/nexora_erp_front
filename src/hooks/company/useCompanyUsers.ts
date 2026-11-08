"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCompanyUser,
  deleteCompanyUser,
  fetchCompanyUser,
  fetchCompanyUsers,
  updateCompanyUser,
} from "@/services/company/companyUser.service";
import type {
  CreateCompanyUserPayload,
  UpdateCompanyUserPayload,
} from "@/services/company/types";

export const useFetchCompanyUsers = () => {
  return useQuery({
    queryKey: ["company-users"],
    queryFn: fetchCompanyUsers,
  });
};

export const useFetchCompanyUser = (companyUserId: number | null) => {
  return useQuery({
    queryKey: ["company-users", "detail", companyUserId],
    queryFn: () => fetchCompanyUser(companyUserId as number),
    enabled: companyUserId !== null,
  });
};

export const useCreateCompanyUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      companyId,
      payload,
    }: {
      companyId: number;
      payload: CreateCompanyUserPayload;
    }) => createCompanyUser(companyId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-users"] });
    },
  });
};

export const useUpdateCompanyUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      companyUserId,
      payload,
    }: {
      companyUserId: number;
      payload: UpdateCompanyUserPayload;
    }) => updateCompanyUser(companyUserId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-users"] });
    },
  });
};

export const useDeleteCompanyUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (companyUserId: number) => deleteCompanyUser(companyUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-users"] });
    },
  });
};
