import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { syncDueSubscriptions } from "../../services/apiSubscription";
import { useUser } from "../authentication/useUser";
import { invalidateSubscriptionDerivedQueries } from "../../utils/invalidateQueries";

export function useSyncSubscriptions() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const isSyncingRef = useRef(false);

  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;

    async function runSync() {
      if (isSyncingRef.current) return;

      isSyncingRef.current = true;

      try {
        const inserted = await syncDueSubscriptions();

        if (!cancelled && inserted >= 0) {
          invalidateSubscriptionDerivedQueries(queryClient);
        }
      } catch (error) {
        console.error("Subscription sync failed:", error);
      } finally {
        isSyncingRef.current = false;
      }
    }

    runSync();

    function handleFocus() {
      runSync();
    }

    window.addEventListener("focus", handleFocus);
    const intervalId = window.setInterval(runSync, 15 * 60 * 1000);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", handleFocus);
      window.clearInterval(intervalId);
    };
  }, [user?.id, queryClient]);
}
