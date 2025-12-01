import { useQuery } from "@tanstack/react-query";
import { getExpense } from "../../services/apiExpense";
import { useUser } from "../authentication/useUser";

export function useExpense() {
  const { user } = useUser();
  const { data: expenses, isLoading } = useQuery({
    queryKey: ["expense", user?.id],
    queryFn: () => getExpense(user.id),
  });

  return { expenses, isLoading };
}
