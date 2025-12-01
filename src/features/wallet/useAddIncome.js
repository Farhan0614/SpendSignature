import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addIncome as addIncomeApi } from "../../services/apiWallet";
import toast from "react-hot-toast";

export function useAddIncome() {
  const queryClient = useQueryClient();

  const { mutate: addIncome, isPending: isAddingIncome } = useMutation({
    mutationFn: addIncomeApi,
    onSuccess: () => {
      toast.success("Income added Successfully!");
      queryClient.invalidateQueries({
        queryKey: ["income"],
      });
      queryClient.invalidateQueries({ queryKey: ["monthlyBalance"] });
      queryClient.invalidateQueries({ queryKey: ["totalBalance"] });
    },
    onError: () => {
      toast.error("There was an error adding income.");
    },
  });

  return { addIncome, isAddingIncome };
}
