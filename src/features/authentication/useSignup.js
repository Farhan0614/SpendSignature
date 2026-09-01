import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup as signupAPI } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function useSignup() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: signup, isPending: isLoading } = useMutation({
    mutationFn: signupAPI,
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
      toast.success("Account is successfully created!");
      navigate("/dashboard");
    },
  });

  return { signup, isLoading };
}
