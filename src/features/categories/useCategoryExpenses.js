import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  getExpensesByCategory,
  getCategoryStats,
} from "../../services/apiExpense";
import { useSearchParams } from "react-router-dom";

export function useCategoryExpenses(user_id, categoryName) {
  const [searchParams] = useSearchParams();

  // 1. Get Params
  const view = searchParams.get("view") || "monthly";
  const month =
    searchParams.get("month") || new Date().toISOString().slice(0, 7);
  const year = searchParams.get("year") || new Date().getFullYear().toString();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  // 2. Query for LIST (Paginated)
  const { data: { data: expenses, count } = {}, isLoading: isLoadingList } =
    useQuery({
      queryKey: [
        "categoryExpenses",
        user_id,
        categoryName,
        view,
        month,
        year,
        page,
      ],
      queryFn: () =>
        getExpensesByCategory({
          user_id,
          categoryName,
          view,
          month,
          year,
          page,
        }),
      placeholderData: keepPreviousData, // Keeps UI stable while fetching next page
      enabled: !!user_id,
    });

  // 3. Query for STATS (Aggregated)
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["categoryStats", user_id, categoryName, view, month, year],
    queryFn: () =>
      getCategoryStats({ user_id, categoryName, view, month, year }),
    enabled: !!user_id,
  });

  return {
    expenses,
    count,
    stats,
    isLoading: isLoadingList || isLoadingStats,
    view,
  };
}
