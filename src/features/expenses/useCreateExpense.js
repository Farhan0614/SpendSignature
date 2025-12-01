import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExpense as createExpenseApi } from "../../services/apiExpense";
import toast from "react-hot-toast";

export function useCreateExpense() {
  const queryClient = useQueryClient();
  const { mutate: createExpense, isPending: isCreating } = useMutation({
    mutationFn: createExpenseApi,
    onSuccess: () => {
      toast.success("Expense is created successfully.");
      queryClient.invalidateQueries({
        queryKey: ["expense"],
      });
      queryClient.invalidateQueries({
        queryKey: ["CategoryExpenses"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["categories-with-monthly-totals"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["monthlyExpense"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["monthlyBalance"],
        exact: false,
      });
    },
    onError: () => {
      toast.error("There was an error adding expense.");
    },
  });

  return { createExpense, isCreating };
}
