import { useQuery } from "@tanstack/react-query";
import { getBalanceView } from "../../services/apiWallet"; // Import the new function
import { useUser } from "../authentication/useUser";

export function useBalanceData() {
  const { user } = useUser();

  const { data: balanceData, isLoading } = useQuery({
    queryKey: ["balanceSummary", user?.id],
    queryFn: () => getBalanceView(user.id),
    enabled: !!user,
  });

  return {
    totalIncome: balanceData?.total_income || 0,
    totalExpense: balanceData?.total_expense || 0,
    currentBalance: balanceData?.current_balance || 0,
    isLoading,
  };
}
