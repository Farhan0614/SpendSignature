import { useState } from "react";
import ExpenseRow from "./ExpenseRow";
import { FaCaretDown, FaCaretRight } from "react-icons/fa";
import { formatCurrency } from "../../utils/helpers";
import { useCurrency } from "../../context/CurrencyContext";
import IncomeRow from "./IncomeRow";
function GroupExpense({ groupExpenses }) {
  const [showExpense, setShowExpense] = useState(true);
  const { period, transactions, total } = groupExpenses;
  const { currency } = useCurrency();

  function handleClick() {
    setShowExpense((show) => !show);
  }

  return (
    // 1. Increased bottom margin to separate different months better
    <div className="mb-6 last:mb-0">
      {/* Premium Sticky Header Ribbon */}
      <div className="sticky top-0 z-10 mb-3 flex items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50/90 px-4 py-2.5 shadow-sm backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/90">
        <div className="flex items-center gap-3">
          {/* Button elevated to look clickable against the slate background */}
          <button
            onClick={handleClick}
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border border-slate-200/60 bg-white text-slate-500 shadow-sm transition-all duration-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
          >
            {showExpense ? <FaCaretDown /> : <FaCaretRight />}
          </button>

          {/* High-contrast typography for the Header */}
          <span className="text-xs font-black tracking-widest text-slate-500 uppercase dark:text-slate-400">
            {period}
          </span>
        </div>

        {/* Standard Expense Total Badge */}
        <span className="rounded-lg border border-slate-100 bg-white px-3 py-1 text-xs font-black text-indigo-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-indigo-400">
          {formatCurrency(total, currency)}
        </span>
      </div>

      {/* Row Wrapper with a subtle 'Folder Tree' left-indent */}
      <div
        className={`ml-3 flex flex-col gap-1 border-l-2 border-slate-100 pl-3 dark:border-slate-700 ${
          showExpense ? "block" : "hidden"
        }`}
      >
        {/* Render correct row based on transaction type */}
        {transactions.map((trx) =>
          trx.type === "expense" ? (
            <ExpenseRow expense={trx} key={`exp-${trx.id}`} />
          ) : (
            <IncomeRow incomeItem={trx} key={`inc-${trx.id}`} />
          ),
        )}
      </div>
    </div>
  );
}

export default GroupExpense;
