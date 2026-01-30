import { FaHashtag } from "react-icons/fa";
import { formatCurrency } from "../../utils/helpers";
import { useCurrency } from "../../context/CurrencyContext";

function CategorySpending({ viewTotal = 0, globalTotal = 0, view }) {
  const { currency } = useCurrency();

  // Dynamic Label: "Spent This Month" vs "Spent This Year"
  const viewLabel = view === "monthly" ? "Spent This Month" : "Spent This Year";

  return (
    <div className="mb-10 flex items-center gap-6 border-b border-slate-50 pb-4">
      {/* 1. VIEW TOTAL (Context Aware) */}
      <div>
        <div className="flex items-center gap-1 font-sans text-sm font-semibold text-slate-500">
          <FaHashtag className="text-slate-400" />
          <span>{viewLabel}</span>
        </div>
        <span className="font-sans text-sm font-bold text-slate-700">
          {formatCurrency(viewTotal, currency)}
        </span>
      </div>

      {/* 2. GLOBAL TOTAL (All Time) */}
      <div>
        <div className="flex items-center gap-1 font-sans text-sm font-semibold text-slate-500">
          <FaHashtag className="text-slate-400" />
          <span>Total Spent (All Time)</span>
        </div>
        <span className="font-sans text-sm font-bold text-slate-700">
          {formatCurrency(globalTotal, currency)}
        </span>
      </div>
    </div>
  );
}

export default CategorySpending;
