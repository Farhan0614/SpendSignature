import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addIncome as addIncomeApi } from "../../services/apiWallet";
import toast from "react-hot-toast";

export function useAddIncome() {
  const queryClient = useQueryClient();

  const { mutate: addIncome, isPending: isAddingIncome } = useMutation({
    mutationFn: addIncomeApi,
    onSuccess: () => {
      toast.success("Income added Successfully!");
      // 1. Refresh Wallet Page (The heavy list)
      queryClient.invalidateQueries({ queryKey: ["income"] });

      // 2. Refresh Dashboard Widgets
      queryClient.invalidateQueries({ queryKey: ["recentIncomes"] });
      queryClient.invalidateQueries({ queryKey: ["monthIncome"] });

      // 3. Refresh Global Balance (The HUD in Navbar)
      queryClient.invalidateQueries({ queryKey: ["incomeAmounts"] });
    },
    onError: () => {
      toast.error("There was an error adding income.");
    },
  });

  return { addIncome, isAddingIncome };
}
