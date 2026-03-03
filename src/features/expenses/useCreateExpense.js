import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExpense as createExpenseApi } from "../../services/apiExpense";
import toast from "react-hot-toast";

export function useCreateExpense() {
  const queryClient = useQueryClient();
  const { mutate: createExpense, isPending: isCreating } = useMutation({
    mutationFn: createExpenseApi,
    onSuccess: () => {
      toast.success("Expense is created successfully.");
      // 1. Refresh Expenses Page (Wipes all views: monthly, yearly, etc.)
      queryClient.invalidateQueries({ queryKey: ["expenses"] }); // CHANGED from "expense" to "expenses"

      // 2. Refresh Dashboard
      queryClient.invalidateQueries({ queryKey: ["recentExpenses"] });
      queryClient.invalidateQueries({ queryKey: ["monthExpenses"] });
      queryClient.invalidateQueries({ queryKey: ["chartExpenses"] }); // Added this for chart

      // 3. Refresh Global Balance
      queryClient.invalidateQueries({ queryKey: ["expenseAmounts"] });

      // 4. Refresh Category Details (If user is on that page)
      // exact: false means it invalidates ["CategoryExpenses", "Food"] and ["CategoryExpenses", "Travel"] etc.
      queryClient.invalidateQueries({
        queryKey: ["categoryExpenses"],
        exact: false,
      });
    },
    onError: () => {
      toast.error("There was an error adding expense.");
    },
  });

  return { createExpense, isCreating };
}
