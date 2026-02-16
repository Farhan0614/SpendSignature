import { useState } from "react";
import { checkAnomaly } from "../../services/aiService";
import { useUser } from "../authentication/useUser";

export function usePredictAnomaly() {
  const [isChecking, setIsChecking] = useState(false);
  const [anomalyResult, setAnomalyResult] = useState(null);
  const { user } = useUser();

  const predict = async ({
    amount,
    categoryId,
    onSuccessNormal,
    onAnomaly,
  }) => {
    setIsChecking(true);
    setAnomalyResult(null);

    try {
      const result = await checkAnomaly(amount, categoryId, user.id);

      if (result.alert) {
        // 1. ANOMALY DETECTED: Save result and trigger UI warning
        setAnomalyResult(result);
        onAnomaly();
      } else {
        // 2. NORMAL: Proceed immediately
        onSuccessNormal();
      }
    } catch (err) {
      console.error(err);
      // Fail Safe: If AI breaks, assume normal and save
      onSuccessNormal();
    } finally {
      setIsChecking(false);
    }
  };

  const resetAnomaly = () => setAnomalyResult(null);

  return { isChecking, anomalyResult, predict, resetAnomaly };
}
