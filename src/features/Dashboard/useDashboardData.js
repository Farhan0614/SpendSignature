import { useQuery } from "@tanstack/react-query";
import { useUser } from "../authentication/useUser";
import {
  getRecentExpenses,
  getRecentIncomes,
  getCurrentMonthExpenses,
  getCurrentMonthIncome,
} from "../../services/apiDashboard";

export function useDashboardData() {
  const { user } = useUser();
  const userId = user?.id;

  // 1. Recent Activity (Fetch 5 + 5)
  const { data: recentExp, isLoading: load1 } = useQuery({
    queryKey: ["recentExpenses", userId],
    queryFn: () => getRecentExpenses(userId),
    enabled: !!userId,
  });

  const { data: recentInc, isLoading: load2 } = useQuery({
    queryKey: ["recentIncomes", userId],
    queryFn: () => getRecentIncomes(userId),
    enabled: !!userId,
  });

  // 2. Current Month Data (For Charts/Bars)
  const { data: monthExp, isLoading: load3 } = useQuery({
    queryKey: ["monthExpenses", userId],
    queryFn: () => getCurrentMonthExpenses(userId),
    enabled: !!userId,
  });

  const { data: monthInc, isLoading: load4 } = useQuery({
    queryKey: ["monthIncome", userId],
    queryFn: () => getCurrentMonthIncome(userId),
    enabled: !!userId,
  });

  return {
    recentExpenses: recentExp || [],
    recentIncomes: recentInc || [],
    monthExpenses: monthExp || [],
    monthIncomes: monthInc || [],
    isLoading: load1 || load2 || load3 || load4,
  };
}
