"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEmployeeContract,
  deleteEmployeeContract,
  fetchEmployeeContract,
  fetchEmployeeContracts,
  updateEmployeeContract,
} from "@/services/employee/employeeContract.service";
import type {
  CreateEmployeeContractPayload,
  UpdateEmployeeContractPayload,
} from "@/services/employee/types";

export const useFetchEmployeeContracts = (
  employeeId: number | null,
  page = 1,
  perPage = 10,
) => {
  return useQuery({
    queryKey: ["employee-contracts", employeeId, { page, perPage }],
    queryFn: () =>
      fetchEmployeeContracts(employeeId as number, page, perPage),
    enabled: employeeId !== null,
  });
};

export const useFetchEmployeeContract = (contractId: number | null) => {
  return useQuery({
    queryKey: ["employee-contracts", "detail", contractId],
    queryFn: () => fetchEmployeeContract(contractId as number),
    enabled: contractId !== null,
  });
};

export const useCreateEmployeeContractMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      payload,
    }: {
      employeeId: number;
      payload: CreateEmployeeContractPayload;
    }) => createEmployeeContract(employeeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-contracts"] });
    },
  });
};

export const useUpdateEmployeeContractMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      contractId,
      payload,
    }: {
      contractId: number;
      payload: UpdateEmployeeContractPayload;
    }) => updateEmployeeContract(contractId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-contracts"] });
    },
  });
};

export const useDeleteEmployeeContractMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contractId: number) => deleteEmployeeContract(contractId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-contracts"] });
    },
  });
};
