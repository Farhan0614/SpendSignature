import { useQuery } from "@tanstack/react-query";
import { getMonthlyBalance } from "../../services/apiWallet";

export function useMonthlyBalance(user_id) {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const { data: monthlyBalance, isLoading } = useQuery({
    queryKey: ["monthlyBalance", user_id, currentMonth, currentYear],
    queryFn: () => getMonthlyBalance(user_id, currentMonth, currentYear),
    enabled: !!user_id,
  });

  return { monthlyBalance, isLoading };
}
