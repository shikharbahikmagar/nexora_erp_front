"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignUserRole } from "@/services/user/userRole.service";
import type { AssignRolePayload } from "@/services/employee/types";

export const useAssignRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: number;
      payload: AssignRolePayload;
    }) => assignUserRole(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-users"] });
    },
  });
};
