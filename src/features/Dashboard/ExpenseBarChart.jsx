import { useCurrency } from "../../context/CurrencyContext";
import { formatCurrency } from "../../utils/helpers";

function ExpenseProgressBar({ income = 0, expense = 0 }) {
  const { currency } = useCurrency();

  // 1. Calculate the raw percentage (can go above 100)
  const rawPercentage = income > 0 ? (expense / income) * 100 : 0;

  // 2. Clamp visual width to 100% so the bar doesn't overflow
  const percentage = Math.min(rawPercentage, 100);

  // 3. Check if over budget
  const isOverBudget = rawPercentage > 100;

  // 4. Dynamic Color Logic
  let colorClass = "bg-emerald-500";
  if (isOverBudget)
    colorClass = "bg-red-600"; // Darker red for over budget
  else if (percentage >= 90) colorClass = "bg-red-500";
  else if (percentage >= 75) colorClass = "bg-amber-500";

  return (
    <div className="flex h-full w-full flex-col justify-center p-6">
      <h3 className="mb-3 text-lg font-bold text-slate-700">Budget Health</h3>

      <div className="mb-2 flex justify-between text-sm font-medium text-slate-500">
        <span>Used</span>
        {/* If over budget, show specific warning text instead of percentage */}
        <span
          className={isOverBudget ? "animate-pulse font-bold text-red-600" : ""}
        >
          {isOverBudget ? "Over Budget!" : `${percentage.toFixed(0)}%`}
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
            <span
              className={`font-semibold ${isOverBudget ? "text-red-600" : "text-slate-600"}`}
            >
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
