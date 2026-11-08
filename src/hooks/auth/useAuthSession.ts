"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authLogout, authMe } from "@/services/auth/auth.service";

export const useMe = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: authMe,
    retry: false,
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authLogout,
    onSuccess: () => {
      localStorage.removeItem("nexora_token");
      queryClient.clear();
    },
  });
};
