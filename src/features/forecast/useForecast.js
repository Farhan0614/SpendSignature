// src/features/forecast/useForecast.js
import { useState } from "react";
import toast from "react-hot-toast";
import { generateForecast as generateForecastApi } from "../../services/apiForecast";

export function useForecast() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  async function generateForecast(userId) {
    if (!userId) return;

    setIsGenerating(true);
    setErrorMsg(null); // Reset errors before new fetch

    try {
      const data = await generateForecastApi(userId);
      setReport(data);
      toast.success("AI Outlook Generated!");
    } catch (error) {
      setErrorMsg(error.message);
      toast.error("Failed to generate report.");
    } finally {
      setIsGenerating(false);
    }
  }

  // We return exactly what the UI needs to render
  return {
    isGenerating,
    report,
    errorMsg,
    generateForecast,
  };
}
