import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createSubscription as createSubscriptionApi,
  syncDueSubscriptions,
} from "../../services/apiSubscription";
import { invalidateSubscriptionDerivedQueries } from "../../utils/invalidateQueries";

export function useCreateSubscription() {
  const queryClient = useQueryClient();

  const { mutate: createSubscription, isPending: isCreating } = useMutation({
    mutationFn: createSubscriptionApi,
    onSuccess: async () => {
      await syncDueSubscriptions();
      invalidateSubscriptionDerivedQueries(queryClient);
      toast.success("Subscription created successfully.");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create subscription.");
    },
  });

  return { createSubscription, isCreating };
}
