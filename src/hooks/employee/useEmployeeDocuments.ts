"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEmployeeDocument,
  deleteEmployeeDocument,
  fetchEmployeeDocument,
  fetchEmployeeDocuments,
  updateEmployeeDocument,
} from "@/services/employee/employeeDocument.service";
import type {
  CreateEmployeeDocumentPayload,
  UpdateEmployeeDocumentPayload,
} from "@/services/employee/types";

export const useFetchEmployeeDocuments = (
  employeeId: number | null,
  page = 1,
  perPage = 10,
) => {
  return useQuery({
    queryKey: ["employee-documents", employeeId, { page, perPage }],
    queryFn: () =>
      fetchEmployeeDocuments(employeeId as number, page, perPage),
    enabled: employeeId !== null,
  });
};

export const useFetchEmployeeDocument = (documentId: number | null) => {
  return useQuery({
    queryKey: ["employee-documents", "detail", documentId],
    queryFn: () => fetchEmployeeDocument(documentId as number),
    enabled: documentId !== null,
  });
};

export const useCreateEmployeeDocumentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      payload,
    }: {
      employeeId: number;
      payload: CreateEmployeeDocumentPayload;
    }) => createEmployeeDocument(employeeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-documents"] });
    },
  });
};

export const useUpdateEmployeeDocumentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentId,
      payload,
    }: {
      documentId: number;
      payload: UpdateEmployeeDocumentPayload;
    }) => updateEmployeeDocument(documentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-documents"] });
    },
  });
};

export const useDeleteEmployeeDocumentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: number) => deleteEmployeeDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-documents"] });
    },
  });
};
