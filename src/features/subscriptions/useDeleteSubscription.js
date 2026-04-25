import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteSubscription as deleteSubscriptionApi } from "../../services/apiSubscription";

export function useDeleteSubscription() {
  const queryClient = useQueryClient();

  const { mutate: deleteSubscription, isPending: isDeleting } = useMutation({
    mutationFn: deleteSubscriptionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Subscription deleted.");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete subscription.");
    },
  });

  return { deleteSubscription, isDeleting };
}
