import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getIncomes } from "../../services/apiWallet";
import { useUser } from "../authentication/useUser";

export function useGetIncome() {
  const { user } = useUser();
  const [searchParams] = useSearchParams();

  // 1. Determine View Mode
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
    cacheKey = ["incomes", user?.id, "monthly", currentMonthStr];
  } else {
    queryArgs.year = parseInt(currentYearStr);
    cacheKey = ["incomes", user?.id, "yearly", currentYearStr];
  }

  const { data: incomes, isLoading } = useQuery({
    queryKey: cacheKey,
    queryFn: () => getIncomes(queryArgs),
    enabled: !!user,
  });

  return { incomes, isLoading, view, currentMonthStr, currentYearStr };
}
