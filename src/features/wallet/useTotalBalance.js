import { useQuery } from "@tanstack/react-query";
import { getTotalBalance } from "../../services/apiWallet";

export function useTotalBalance(user_id) {
  const { data: totalBalance, isLoading } = useQuery({
    queryKey: ["totalBalance", user_id],
    queryFn: () => getTotalBalance(user_id),
    enabled: !!user_id,
  });

  return { totalBalance, isLoading };
}
