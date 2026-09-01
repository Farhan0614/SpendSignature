// src/pages/Forecast.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiSparkles } from "react-icons/hi2";
import { HiOutlineDocumentSearch } from "react-icons/hi";

import { useUser } from "../features/authentication/useUser";
import { useCurrency } from "../context/CurrencyContext";
import { useForecast } from "../features/forecast/useForecast"; // <-- IMPORT YOUR NEW HOOK

import Button from "../ui/Button";
import Heading from "../ui/Heading";
import Redirect from "../ui/Redirect";

import ForecastMetrics from "../features/forecast/ForecastMetrics";
import ForecastInsights from "../features/forecast/ForecastInsights";
import ForecastChart from "../features/forecast/ForecastChart";

const LOADING_MESSAGES = [
  "Analyzing historical data...",
  "Running mathematical models...",
  "Consulting AI Financial Advisor...",
  "Generating your future outlook...",
];

function Forecast() {
  const { isAuthenticated } = useUser();
  const { currency } = useCurrency();
  const navigate = useNavigate();

  // --- USE YOUR CUSTOM HOOK ---
  const { isGenerating, report, errorMsg, generateForecast } = useForecast();

  // UI State for cycling loading messages
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    let interval;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingStep((prev) =>
          prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev,
        );
      }, 2000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  if (!isAuthenticated) return <Redirect pageName="forecast" />;

  return (
    <div className="space-y-8 pb-10">
      <header className="flex items-center gap-2 border-b border-slate-200 pb-6 dark:border-slate-800">
        <HiSparkles className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        <div>
          <Heading>AI Future Forecast</Heading>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Predict your financial future using AI and historical trends.
          </p>
        </div>
      </header>

      {/* ERROR STATE: COLD START */}
      {errorMsg && !isGenerating && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-rose-200 bg-rose-50/50 py-20 text-center dark:border-rose-900/50 dark:bg-rose-950/20">
          <div className="mb-4 rounded-full bg-rose-100 p-4 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400">
            <HiOutlineDocumentSearch size={40} />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-slate-800 dark:text-white">
            Need More Data
          </h2>
          <p className="mx-auto mb-8 max-w-md text-slate-600 dark:text-slate-400">
            {errorMsg}
          </p>
          <Button
            onClick={() => navigate("/expense")}
            className="px-8 py-4 text-lg"
          >
            Log New Expenses
          </Button>
        </div>
      )}

      {/* EMPTY STATE */}
      {!report && !isGenerating && !errorMsg && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-indigo-200 bg-indigo-50/50 py-20 text-center dark:border-indigo-900/50 dark:bg-indigo-950/20">
          <div className="mb-4 rounded-full bg-indigo-100 p-4 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            <HiSparkles size={40} />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-slate-800 dark:text-white">
            Ready to see your future?
          </h2>
          <p className="mb-8 max-w-md text-slate-500 dark:text-slate-400">
            Our AI will analyze your past spending habits to predict your
            financial trajectory for the next 3 months.
          </p>
          {/* Note: We pass the user.id directly to the hook's function here */}
          <Button
            onClick={() => generateForecast()}
            className="px-8 py-4 text-lg"
          >
            Generate Future Report
          </Button>
        </div>
      )}

      {/* LOADING STATE */}
      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="mb-6 h-16 w-16 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 dark:border-indigo-900 dark:border-t-indigo-400"></div>
          <h3 className="animate-pulse text-lg font-bold text-indigo-600 dark:text-indigo-400">
            {LOADING_MESSAGES[loadingStep]}
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            This may take 20-30 seconds...
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Please do not change the tab while data is processing!
          </p>
        </div>
      )}

      {/* RESULTS STATE */}
      {report && !isGenerating && (
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-700">
          <ForecastMetrics metrics={report.metrics} currency={currency} />
          <ForecastInsights aiSummary={report.aiSummary} />
          <ForecastChart
            chartData={report.chartData}
            metrics={report.metrics}
            currency={currency}
          />

          <div className="flex justify-end">
            <Button variant="secondary" onClick={() => generateForecast()}>
              Recalculate Forecast
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Forecast;
