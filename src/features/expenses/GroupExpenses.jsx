import { useState } from "react";
import ExpenseRow from "./ExpenseRow";
import { FaCaretDown, FaCaretRight } from "react-icons/fa";
import { formatCurrency } from "../../utils/helpers";
import { useCurrency } from "../../context/CurrencyContext";
function GroupExpense({ groupExpenses }) {
  const [showExpense, setShowExpense] = useState(true);
  const { period, expenses, total } = groupExpenses;
  const { currency } = useCurrency();

  function handleClick() {
    setShowExpense((show) => !show);
  }

  return (
    <div className="mb-6 border-b border-slate-200">
      <div className="flex items-center gap-2 py-3">
        <button
          onClick={handleClick}
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-xs transition-all duration-300 hover:bg-slate-200 hover:text-slate-500"
        >
          {showExpense ? <FaCaretDown /> : <FaCaretRight />}
        </button>
        <span className="text-normal font-sans font-black text-slate-900">
          {period}
        </span>
        <span className="text-normal font-sans font-medium text-slate-400">
          {formatCurrency(total, currency)}
        </span>
      </div>
      <div className={`${showExpense ? "block" : "hidden"}`}>
        {expenses.map((expense, key) => (
          <ExpenseRow expense={expense} key={key} />
        ))}
      </div>
    </div>
  );
}

export default GroupExpense;
