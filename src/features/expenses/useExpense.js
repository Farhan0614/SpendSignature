import { useQuery } from "@tanstack/react-query";
import { getExpenses } from "../../services/apiExpense";
import { useUser } from "../authentication/useUser";
import { useSearchParams } from "react-router-dom";

export function useExpense() {
  const { user } = useUser();
  const [searchParams] = useSearchParams();

  const view = searchParams.get("view") || "monthly";
  const rawSearchTerm = searchParams.get("search") || "";
  const searchTerm = rawSearchTerm.trim();

  const currentMonthStr =
    searchParams.get("month") || new Date().toISOString().slice(0, 7);
  const currentYearStr =
    searchParams.get("year") || new Date().getFullYear().toString();

  const queryArgs = {
    user_id: user?.id,
    searchTerm,
  };

  if (!searchTerm) {
    if (view === "monthly") queryArgs.month = currentMonthStr;
    else queryArgs.year = Number(currentYearStr);
  }

  const { data: expenses = [], isLoading } = useQuery({
    queryKey: [
      "expenses",
      user?.id,
      view,
      currentMonthStr,
      currentYearStr,
      searchTerm,
    ],
    queryFn: () => getExpenses(queryArgs),
    enabled: !!user,
  });

  return { expenses, isLoading, view, searchTerm, isSearching: !!searchTerm };
}
