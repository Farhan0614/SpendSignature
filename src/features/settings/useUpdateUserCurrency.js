import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserCurrency as updateUserCurrencyAPI } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useUpdateUserCurrency() {
  const queryClient = useQueryClient();

  const { mutate: updateUserCurrency, isPending: isLoading } = useMutation({
    mutationFn: updateUserCurrencyAPI,
    onSuccess: (data) => {
      console.log(data);
      toast.success("User currency updates successfully!");
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { updateUserCurrency, isLoading };
}
