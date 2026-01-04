import { useCurrency } from "../../context/CurrencyContext";
import { formatCurrency } from "../../utils/helpers";

function ExpenseProgressBar({ income = 0, expense = 0 }) {
  const { currency } = useCurrency();

  // Calculate percentage safely
  const rawPercentage = income > 0 ? (expense / income) * 100 : 0;
  const percentage = Math.min(rawPercentage, 100);

  // Dynamic Color Logic
  let colorClass = "bg-emerald-500";
  if (percentage >= 90) colorClass = "bg-red-500";
  else if (percentage >= 75) colorClass = "bg-amber-500";

  return (
    // ADDED: p-6 to give breathing room inside the white card
    <div className="flex h-full w-full flex-col justify-center p-6">
      <h3 className="mb-3 text-lg font-bold text-slate-700">Budget Health</h3>

      <div className="mb-2 flex justify-between text-sm font-medium text-slate-500">
        <span>Used</span>
        <span className={percentage >= 100 ? "font-bold text-red-500" : ""}>
          {percentage.toFixed(0)}%
        </span>
      </div>

      {/* Progress Bar Track */}
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Context Text */}
      <p className="mt-3 text-xs text-slate-400">
        {income > 0 ? (
          <>
            <span className="font-semibold text-slate-600">
              {formatCurrency(expense, currency)}
            </span>{" "}
            spent of{" "}
            <span className="font-semibold text-slate-600">
              {formatCurrency(income, currency)}
            </span>{" "}
            limit
          </>
        ) : (
          "Add income to enable budget tracking"
        )}
      </p>
    </div>
  );
}

export default ExpenseProgressBar;
