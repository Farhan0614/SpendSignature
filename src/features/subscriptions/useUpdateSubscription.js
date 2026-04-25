import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  updateSubscription as updateSubscriptionApi,
  syncDueSubscriptions,
} from "../../services/apiSubscription";
import { invalidateSubscriptionDerivedQueries } from "../../utils/invalidateQueries";

export function useUpdateSubscription() {
  const queryClient = useQueryClient();

  const { mutate: updateSubscription, isPending: isUpdating } = useMutation({
    mutationFn: updateSubscriptionApi,
    onSuccess: async () => {
      await syncDueSubscriptions();
      invalidateSubscriptionDerivedQueries(queryClient);
      toast.success("Subscription updated successfully.");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update subscription.");
    },
  });

  return { updateSubscription, isUpdating };
}
