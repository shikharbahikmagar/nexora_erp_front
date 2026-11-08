import { authRegiser } from "@/services/auth/auth.service"
import { useMutation } from "@tanstack/react-query"

export const useAuthRegisterMutation = () => {

  return useMutation({

    mutationFn: authRegiser

  });

}
