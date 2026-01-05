import { useQuery } from "@tanstack/react-query";
import { getExpenseAmounts, getIncomeAmounts } from "../../services/apiWallet";
import { useUser } from "../authentication/useUser";

export function useBalanceData() {
  const { user } = useUser();

  // 1. Fetch Income Amounts
  const { data: incomeData, isLoading: loadingIncome } = useQuery({
    queryKey: ["incomeAmounts", user?.id],
    queryFn: () => getIncomeAmounts(user.id),
    enabled: !!user,
  });

  // 2. Fetch Expense Amounts
  const { data: expenseData, isLoading: loadingExpense } = useQuery({
    queryKey: ["expenseAmounts", user?.id],
    queryFn: () => getExpenseAmounts(user.id),
    enabled: !!user,
  });

  // 3. Calculate Totals Here (So components don't have to)
  const totalIncome =
    incomeData?.reduce((sum, item) => sum + item.income, 0) || 0;
  const totalExpense =
    expenseData?.reduce((sum, item) => sum + item.amount, 0) || 0;
  const currentBalance = totalIncome - totalExpense;

  return {
    totalIncome,
    totalExpense,
    currentBalance,
    isLoading: loadingIncome || loadingExpense,
  };
}
