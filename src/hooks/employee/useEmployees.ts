"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEmployee,
  deleteEmployee,
  fetchEmployee,
  fetchEmployees,
  updateEmployee,
} from "@/services/employee/employee.service";
import type {
  CreateEmployeePayload,
  UpdateEmployeePayload,
} from "@/services/employee/types";

export const useFetchEmployees = (perPage = 100) => {
  return useQuery({
    queryKey: ["employees", { perPage }],
    queryFn: () => fetchEmployees(perPage),
  });
};

export const useFetchEmployee = (employeeId: number | null) => {
  return useQuery({
    queryKey: ["employees", "detail", employeeId],
    queryFn: () => fetchEmployee(employeeId as number),
    enabled: employeeId !== null,
  });
};

export const useCreateEmployeeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) => createEmployee(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

export const useUpdateEmployeeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      payload,
    }: {
      employeeId: number;
      payload: UpdateEmployeePayload;
    }) => updateEmployee(employeeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

export const useDeleteEmployeeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeId: number) => deleteEmployee(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee-contracts"] });
      queryClient.invalidateQueries({ queryKey: ["employee-documents"] });
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
    },
  });
};
