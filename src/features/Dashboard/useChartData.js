import { useQuery } from "@tanstack/react-query";
import { subMonths, startOfMonth, endOfMonth } from "date-fns";
import { useUser } from "../authentication/useUser";
import { getExpensesInRange } from "../../services/apiExpense";
import { getIncomesInRange } from "../../services/apiWallet";
import { useSearchParams } from "react-router-dom";

export function useChartData() {
  const { user } = useUser();
  const [searchParams] = useSearchParams();

  // 1. Determine the "Anchor Date" (Selected Month or Today)
  const currentMonthStr =
    searchParams.get("month") || new Date().toISOString().slice(0, 7);
  const anchorDate = new Date(`${currentMonthStr}-01`);

  // 2. Calculate Range (Last 6 Months relative to anchor)
  const startDate = startOfMonth(subMonths(anchorDate, 5)).toISOString();
  const endDate = endOfMonth(anchorDate).toISOString();

  // 3. Fetch Expenses in Range
  const { data: expenses, isLoading: loadExp } = useQuery({
    queryKey: ["chartExpenses", user?.id, startDate, endDate],
    queryFn: () => getExpensesInRange(user.id, startDate, endDate),
    enabled: !!user,
  });

  // 4. Fetch Incomes in Range
  const { data: incomes, isLoading: loadInc } = useQuery({
    queryKey: ["chartIncomes", user?.id, startDate, endDate],
    queryFn: () => getIncomesInRange(user.id, startDate, endDate),
    enabled: !!user,
  });

  return { expenses, incomes, isLoading: loadExp || loadInc, anchorDate };
}
