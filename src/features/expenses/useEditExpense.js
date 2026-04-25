import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editExpense as editExpenseAPI } from "../../services/apiExpense";
import toast from "react-hot-toast";
import { invalidateExpenseDerivedQueries } from "../../utils/invalidateQueries";

export function useEditExpense() {
  const queryClient = useQueryClient();

  const { mutate: editExpense, isPending: isEditing } = useMutation({
    mutationFn: editExpenseAPI,
    onSuccess: () => {
      toast.success("Expense updated successfully");
      invalidateExpenseDerivedQueries(queryClient);
    },
    onError: (err) => toast.error(err.message),
  });

  return { editExpense, isEditing };
}
