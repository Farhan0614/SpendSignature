import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editExpense as editExpenseAPI } from "../../services/apiExpense";
import toast from "react-hot-toast";

export function useEditExpense() {
  const queryClient = useQueryClient();

  const { mutate: editExpense, isPending: isEditing } = useMutation({
    mutationFn: editExpenseAPI,
    onSuccess: () => {
      toast.success("Expense updated successfully");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["recentExpenses"] });
      queryClient.invalidateQueries({ queryKey: ["monthExpenses"] });
      queryClient.invalidateQueries({ queryKey: ["chartExpenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenseAmounts"] });
      queryClient.invalidateQueries({ queryKey: ["CategoryExpenses"] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { editExpense, isEditing };
}
