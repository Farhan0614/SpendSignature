import { useQuery } from "@tanstack/react-query";
import { getMonthlyExpense } from "../../services/apiExpense";

export function useMonthlyExpense(user_id) {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const { data: monthlyExpense, isLoading } = useQuery({
    queryKey: ["monthlyExpense", user_id, currentMonth, currentYear],
    queryFn: () => getMonthlyExpense(user_id, currentMonth, currentYear),
    enabled: !!user_id,
  });

  return { monthlyExpense, isLoading };
}
