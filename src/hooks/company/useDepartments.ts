"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDepartment,
  deleteDepartment,
  fetchDepartment,
  fetchDepartments,
  updateDepartment,
} from "@/services/company/department.service";
import type {
  CreateDepartmentPayload,
  UpdateDepartmentPayload,
} from "@/services/company/types";

export const useFetchDepartments = (
  companyId: number | null,
  page = 1,
  perPage = 10,
) => {
  return useQuery({
    queryKey: ["departments", companyId, { page, perPage }],
    queryFn: () => fetchDepartments(companyId as number, page, perPage),
    enabled: companyId !== null,
  });
};

export const useFetchDepartment = (departmentId: number | null) => {
  return useQuery({
    queryKey: ["departments", "detail", departmentId],
    queryFn: () => fetchDepartment(departmentId as number),
    enabled: departmentId !== null,
  });
};

export const useCreateDepartmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDepartmentPayload) =>
      createDepartment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};

export const useUpdateDepartmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      departmentId,
      payload,
    }: {
      departmentId: number;
      payload: UpdateDepartmentPayload;
    }) => updateDepartment(departmentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};

export const useDeleteDepartmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (departmentId: number) => deleteDepartment(departmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};
