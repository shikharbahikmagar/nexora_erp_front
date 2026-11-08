import { authLogin } from "@/services/auth/auth.service"
import { useMutation } from "@tanstack/react-query"


export const useAuthLoginMutation = () => {

  return useMutation({

    mutationFn: authLogin

  });



}
