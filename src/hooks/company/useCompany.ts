"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCompany,
  deleteCompany,
  fetchCompany,
  fetchMyCompany,
  updateCompany,
} from "@/services/company/company.service";
import type {
  CreateCompanyPayload,
  UpdateCompanyPayload,
} from "@/services/company/types";

export const useFetchCompanyDetail = (companyId: number | null) => {
  return useQuery({
    queryKey: ["companies", "detail", companyId],
    queryFn: () => fetchCompany(companyId as number),
    enabled: companyId !== null,
  });
};

export const useMyCompany = () => {
  return useQuery({
    queryKey: ["companies", "my"],
    queryFn: fetchMyCompany,
    retry: false,
  });
};

export const useCreateCompanyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCompanyPayload) => createCompany(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};

export const useUpdateCompanyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      companyId,
      payload,
    }: {
      companyId: number;
      payload: UpdateCompanyPayload;
    }) => updateCompany(companyId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};

export const useDeleteCompanyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (companyId: number) => deleteCompany(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};
