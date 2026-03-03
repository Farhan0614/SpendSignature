import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExpense as deleteExpenseAPI } from "../../services/apiExpense";
import toast from "react-hot-toast";

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  const { mutate: deleteExpense, isPending: isDeleting } = useMutation({
    mutationFn: deleteExpenseAPI,
    onSuccess: () => {
      toast.success("Expense deleted");
      // Refresh all relevant data
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["recentExpenses"] });
      queryClient.invalidateQueries({ queryKey: ["monthExpenses"] });
      queryClient.invalidateQueries({ queryKey: ["chartExpenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenseAmounts"] });
      queryClient.invalidateQueries({ queryKey: ["categoryExpenses"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { deleteExpense, isDeleting };
}
