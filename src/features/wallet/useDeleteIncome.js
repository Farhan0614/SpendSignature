import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteIncome as deleteIncomeApi } from "../../services/apiWallet";
import toast from "react-hot-toast";

export function useDeleteIncome() {
  const queryClient = useQueryClient();

  const { mutate: deleteIncome, isPending: isDeleting } = useMutation({
    mutationFn: deleteIncomeApi,
    onSuccess: () => {
      toast.success("Income deleted");
      // Refresh EVERYTHING related to income
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
      queryClient.invalidateQueries({ queryKey: ["incomeAmounts"] });
      queryClient.invalidateQueries({ queryKey: ["balanceSummary"] });
      queryClient.invalidateQueries({ queryKey: ["recentIncomes"] });
      queryClient.invalidateQueries({ queryKey: ["monthIncome"] });
      queryClient.invalidateQueries({ queryKey: ["chartIncomes"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { deleteIncome, isDeleting };
}
