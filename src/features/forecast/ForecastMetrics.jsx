import { HiShieldCheck, HiArrowTrendingUp } from "react-icons/hi2";
import { FaFire } from "react-icons/fa";
import { formatCurrency } from "../../utils/helpers";

function ForecastMetrics({ metrics, currency }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-2 flex items-center gap-2 text-emerald-600">
          <HiShieldCheck size={20} />
          <span className="text-xs font-bold tracking-widest uppercase">
            Runway
          </span>
        </div>
        <p className="text-3xl font-black text-slate-800 dark:text-white">
          {metrics.runway}{" "}
          <span className="text-lg text-slate-400">months</span>
        </p>
        <p className="mt-1 text-xs text-slate-500">Survival without income</p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-2 flex items-center gap-2 text-indigo-600">
          <HiArrowTrendingUp size={20} />
          <span className="text-xs font-bold tracking-widest uppercase">
            3-Month Outlook
          </span>
        </div>
        <p className="text-3xl font-black text-slate-800 dark:text-white">
          {metrics.projectedSavings > 0 ? "+" : ""}
          {formatCurrency(metrics.projectedSavings, currency)}
        </p>
        <p className="mt-1 text-xs text-slate-500">Projected Net Savings</p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-2 flex items-center gap-2 text-red-500">
          <FaFire size={18} />
          <span className="text-xs font-bold tracking-widest uppercase">
            Top Burn Risk
          </span>
        </div>
        <p className="text-2xl font-black text-slate-800 capitalize dark:text-white">
          {metrics.topCategory}
        </p>
        <p className="mt-1 text-xs font-semibold text-rose-500 dark:text-rose-400">
          {metrics.momentumText}
        </p>
      </div>
    </div>
  );
}

export default ForecastMetrics;
