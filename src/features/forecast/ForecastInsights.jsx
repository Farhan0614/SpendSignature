import { HiSparkles } from "react-icons/hi2";

function ForecastInsights({ aiSummary }) {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 p-1 dark:from-indigo-500/20 dark:to-purple-500/20">
      <div className="rounded-[22px] bg-white p-8 dark:bg-slate-900">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white">
          <HiSparkles className="text-indigo-500" /> AI Advisor Insights
        </h3>
        <div className="space-y-4 leading-relaxed text-slate-600 dark:text-slate-300">
          {aiSummary.split("\n\n").map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ForecastInsights;
