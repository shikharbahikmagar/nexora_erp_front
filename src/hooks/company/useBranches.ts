"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBranch,
  deleteBranch,
  fetchBranch,
  fetchBranches,
  updateBranch,
} from "@/services/company/branch.service";
import type {
  CreateBranchPayload,
  UpdateBranchPayload,
} from "@/services/company/types";

export const useFetchBranches = (
  companyId: number | null,
  page = 1,
  perPage = 10,
) => {
  return useQuery({
    queryKey: ["branches", companyId, { page, perPage }],
    queryFn: () => fetchBranches(companyId as number, page, perPage),
    enabled: companyId !== null,
  });
};

export const useFetchBranch = (branchId: number | null) => {
  return useQuery({
    queryKey: ["branches", "detail", branchId],
    queryFn: () => fetchBranch(branchId as number),
    enabled: branchId !== null,
  });
};

export const useCreateBranchMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBranchPayload) => createBranch(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};

export const useUpdateBranchMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      branchId,
      payload,
    }: {
      branchId: number;
      payload: UpdateBranchPayload;
    }) => updateBranch(branchId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};

export const useDeleteBranchMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (branchId: number) => deleteBranch(branchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};
