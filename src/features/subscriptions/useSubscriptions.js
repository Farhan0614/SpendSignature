import { useQuery } from "@tanstack/react-query";
import { useUser } from "../authentication/useUser";
import { getSubscriptions } from "../../services/apiSubscription";

export function useSubscriptions() {
  const { user } = useUser();

  const { data: subscriptions = [], isLoading } = useQuery({
    queryKey: ["subscriptions", user?.id],
    queryFn: () => getSubscriptions(user.id),
    enabled: !!user,
  });

  return { subscriptions, isLoading };
}
