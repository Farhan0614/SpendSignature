import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editIncome as editIncomeApi } from "../../services/apiWallet";
import toast from "react-hot-toast";

export function useEditIncome() {
  const queryClient = useQueryClient();

  const { mutate: editIncome, isPending: isEditing } = useMutation({
    mutationFn: editIncomeApi,
    onSuccess: () => {
      toast.success("Income updated successfully");
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
      queryClient.invalidateQueries({ queryKey: ["incomeAmounts"] });
      queryClient.invalidateQueries({ queryKey: ["recentIncomes"] });
      queryClient.invalidateQueries({ queryKey: ["monthIncome"] });
      queryClient.invalidateQueries({ queryKey: ["chartIncomes"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { editIncome, isEditing };
}
