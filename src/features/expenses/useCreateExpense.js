import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExpense as createExpenseApi } from "../../services/apiExpense";
import toast from "react-hot-toast";
import { invalidateExpenseDerivedQueries } from "../../utils/invalidateQueries";

export function useCreateExpense() {
  const queryClient = useQueryClient();

  const { mutate: createExpense, isPending: isCreating } = useMutation({
    mutationFn: createExpenseApi,
    onSuccess: () => {
      toast.success("Expense is created successfully.");
      invalidateExpenseDerivedQueries(queryClient);
    },
    onError: () => {
      toast.error("There was an error adding expense.");
    },
  });

  return { createExpense, isCreating };
}
