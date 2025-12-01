import { useQuery } from "@tanstack/react-query";
import { getExpensesByCategory } from "../../services/apiExpense";

export function useCategoryExpenses(user_id, categoryName) {
  const { data: categoryExpenses, isLoading } = useQuery({
    queryKey: ["categoryExpenses", user_id, categoryName],
    queryFn: () => getExpensesByCategory(user_id, categoryName),
    enabled: !!user_id && !!categoryName,
  });

  return { categoryExpenses, isLoading };
}
