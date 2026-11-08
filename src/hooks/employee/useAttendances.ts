"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAttendance,
  deleteAttendance,
  fetchAttendance,
  fetchAttendances,
  updateAttendance,
} from "@/services/employee/attendance.service";
import type {
  CreateAttendancePayload,
  UpdateAttendancePayload,
} from "@/services/employee/types";

export const useFetchAttendances = (page = 1, perPage = 10) => {
  return useQuery({
    queryKey: ["attendances", { page, perPage }],
    queryFn: () => fetchAttendances(page, perPage),
  });
};

export const useFetchAttendance = (attendanceId: number | null) => {
  return useQuery({
    queryKey: ["attendances", "detail", attendanceId],
    queryFn: () => fetchAttendance(attendanceId as number),
    enabled: attendanceId !== null,
  });
};

export const useCreateAttendanceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAttendancePayload) => createAttendance(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
    },
  });
};

export const useUpdateAttendanceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      attendanceId,
      payload,
    }: {
      attendanceId: number;
      payload: UpdateAttendancePayload;
    }) => updateAttendance(attendanceId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
    },
  });
};

export const useDeleteAttendanceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attendanceId: number) => deleteAttendance(attendanceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
    },
  });
};
