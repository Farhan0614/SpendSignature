import { useState } from "react";
import toast from "react-hot-toast";
import { generateForecast as generateForecastApi } from "../../services/apiForecast";

export function useForecast() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  async function generateForecast() {
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const data = await generateForecastApi();
      setReport(data);
      toast.success("AI Outlook Generated!");
    } catch (error) {
      setErrorMsg(error.message);
      toast.error("Failed to generate report.");
    } finally {
      setIsGenerating(false);
    }
  }

  return { isGenerating, report, errorMsg, generateForecast };
}
