import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExpense as deleteExpenseAPI } from "../../services/apiExpense";
import toast from "react-hot-toast";
import { invalidateExpenseDerivedQueries } from "../../utils/invalidateQueries";

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  const { mutate: deleteExpense, isPending: isDeleting } = useMutation({
    mutationFn: deleteExpenseAPI,
    onSuccess: () => {
      toast.success("Expense deleted");
      invalidateExpenseDerivedQueries(queryClient);
    },
    onError: (err) => toast.error(err.message),
  });

  return { deleteExpense, isDeleting };
}
