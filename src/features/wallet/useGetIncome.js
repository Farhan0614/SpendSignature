import { useQuery } from "@tanstack/react-query";
import { getIncome } from "../../services/apiWallet";
import { useUser } from "../authentication/useUser";

export function useGetIncome() {
  const { user } = useUser();

  const { data: incomes, isLoading } = useQuery({
    queryKey: ["income", user?.id],
    queryFn: () => getIncome(user?.id),
  });

  return { incomes, isLoading };
}
