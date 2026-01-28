import { useQuery } from "@tanstack/react-query";
import { getExpenses } from "../../services/apiExpense";
import { useUser } from "../authentication/useUser";
import { useSearchParams } from "react-router-dom";

export function useExpense() {
  const { user } = useUser();
  const [searchParams] = useSearchParams();

  // 1. Determine View Mode (Default: Monthly)
  const view = searchParams.get("view") || "monthly";

  // 2. Determine Time Variables
  const currentMonthStr =
    searchParams.get("month") || new Date().toISOString().slice(0, 7);
  const currentYearStr =
    searchParams.get("year") || new Date().getFullYear().toString();

  // 3. Prepare Arguments based on View
  const queryArgs = { user_id: user?.id };
  let cacheKey = [];

  if (view === "monthly") {
    queryArgs.month = currentMonthStr;
    cacheKey = ["expenses", user?.id, "monthly", currentMonthStr];
  } else {
    queryArgs.year = parseInt(currentYearStr);
    cacheKey = ["expenses", user?.id, "yearly", currentYearStr];
  }

  const { data: expenses, isLoading } = useQuery({
    queryKey: cacheKey,
    queryFn: () => getExpenses(queryArgs),
    enabled: !!user,
  });

  return { expenses, isLoading, view };
}
