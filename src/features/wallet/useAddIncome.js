import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addIncome as addIncomeApi } from "../../services/apiWallet";
import toast from "react-hot-toast";

export function useAddIncome() {
  const queryClient = useQueryClient();

  const { mutate: addIncome, isPending: isAddingIncome } = useMutation({
    mutationFn: addIncomeApi,
    onSuccess: () => {
      toast.success("Income added Successfully!");

      queryClient.invalidateQueries({ queryKey: ["incomes"] });

      // 2. Refresh Global Balance (User Menu & Top Cards)
      // Also invalidate expenseAmounts just in case balance calculation relies on both syncing
      queryClient.invalidateQueries({ queryKey: ["incomeAmounts"] });
      queryClient.invalidateQueries({ queryKey: ["expenseAmounts"] });

      //  Refresh Dashboard Widgets (Recent Activity)
      queryClient.invalidateQueries({ queryKey: ["recentIncomes"] });
      queryClient.invalidateQueries({ queryKey: ["monthIncome"] });

      // The chart uses a specific range query. We must force it to redraw.
      queryClient.invalidateQueries({ queryKey: ["chartIncomes"] });
    },
    onError: () => {
      toast.error("There was an error adding income.");
    },
  });

  return { addIncome, isAddingIncome };
}
