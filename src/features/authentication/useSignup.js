import { useMutation } from "@tanstack/react-query";
import { signup as signupAPI } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useSignup() {
  const { mutate: signup, isPending: isLoading } = useMutation({
    mutationFn: signupAPI,
    onSuccess: (data) => {
      toast.success(
        "Account is successfully created! Please verify your account from your gmail inbox",
      );
    },
  });

  return { signup, isLoading };
}
