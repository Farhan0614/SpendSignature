import { useQuery } from "@tanstack/react-query";
import { getMonthAmount } from "../../services/apiExpense";

export function useMonthAmount(startDate, endDate, user_id) {
  const { data: monthAmount, isLoading } = useQuery({
    // FIX: Add startDate and endDate to the dependency array (queryKey)
    queryKey: ["categories-with-monthly-totals", user_id, startDate, endDate],

    queryFn: () => getMonthAmount(startDate, endDate, user_id),
    enabled: !!user_id,
  });

  return { monthAmount, isLoading };
}
