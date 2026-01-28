import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useUser } from "../authentication/useUser";
import { getExpenses } from "../../services/apiExpense";
import { getIncomes } from "../../services/apiWallet";

export function useDashboardData() {
  const { user } = useUser();
  const [searchParams] = useSearchParams();

  const currentMonth =
    searchParams.get("month") || new Date().toISOString().slice(0, 7);

  // 1. Fetch Recent Activity (Limit 5, IGNORE MONTH filter)
  const { data: recentExp, isLoading: load1 } = useQuery({
    queryKey: ["recentExpenses", user?.id],
    queryFn: () => getExpenses({ user_id: user.id, limit: 5 }),
  });

  const { data: recentInc, isLoading: load2 } = useQuery({
    queryKey: ["recentIncomes", user?.id],
    queryFn: () => getIncomes({ user_id: user.id, limit: 5 }),
  });

  // 2. Fetch Selected Month Data (Filter by Month, NO LIMIT)
  const { data: monthExp, isLoading: load3 } = useQuery({
    queryKey: ["monthExpenses", user?.id, currentMonth],
    queryFn: () => getExpenses({ user_id: user.id, month: currentMonth }),
  });

  const { data: monthInc, isLoading: load4 } = useQuery({
    queryKey: ["monthIncome", user?.id, currentMonth],
    queryFn: () => getIncomes({ user_id: user.id, month: currentMonth }),
  });

  return {
    recentExpenses: recentExp || [],
    recentIncomes: recentInc || [],
    monthExpenses: monthExp || [],
    monthIncomes: monthInc || [],
    isLoading: load1 || load2 || load3 || load4,
    currentMonth,
  };
}
