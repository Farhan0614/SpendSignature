import { useState } from "react";
import ExpenseRow from "./ExpenseRow";
import { FaCaretDown, FaCaretRight } from "react-icons/fa";
import { HiPlusSm } from "react-icons/hi"; // <-- Import Plus Icon
import { formatCurrency } from "../../utils/helpers";
import { useCurrency } from "../../context/CurrencyContext";
import IncomeRow from "./IncomeRow";
import Modal from "../../ui/Modal"; // <-- Import Modal
import ExpenseForm from "./ExpenseForm"; // <-- Import Form
import { useCategories } from "../categories/useCategories"; // <-- Import Categories hook

function GroupExpense({ groupExpenses, view }) {
  const [showExpense, setShowExpense] = useState(true);
  const { period, rawDate, transactions, total } = groupExpenses;
  const { currency } = useCurrency();
  const { categories } = useCategories(); // Fetch categories for the modal form

  function handleClick() {
    setShowExpense((show) => !show);
  }

  return (
    <div className="mb-6 last:mb-0">
      <div className="sticky top-0 z-10 mb-3 flex items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50/90 px-4 py-2.5 shadow-sm backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/90">
        {/* Left side: Expand/Collapse & Date */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleClick}
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border border-slate-200/60 bg-white text-slate-500 shadow-sm transition-all duration-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
          >
            {showExpense ? <FaCaretDown /> : <FaCaretRight />}
          </button>
          <span className="text-xs font-black tracking-widest text-slate-500 uppercase dark:text-slate-400">
            {period}
          </span>
        </div>

        {/* Right side: Total and the new "+" Button */}
        <div className="flex items-center gap-3">
          <span className="rounded-lg border border-slate-100 bg-white px-3 py-1 text-xs font-black text-indigo-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-indigo-400">
            {formatCurrency(total, currency)}
          </span>

          {/* Render the "+" button ONLY on the monthly view */}
          {view === "monthly" && (
            <Modal>
              <Modal.Open opens={`add-expense-${rawDate}`}>
                <button
                  title={`Add expense for ${period}`}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 shadow-sm transition-colors hover:bg-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:hover:bg-indigo-500/40"
                >
                  <HiPlusSm className="h-5 w-5" />
                </button>
              </Modal.Open>

              <Modal.Window name={`add-expense-${rawDate}`}>
                <div className="w-[90vw] max-w-4xl pt-4">
                  <h2 className="mb-6 text-2xl font-black text-slate-900 dark:text-white">
                    Add Expense for {period}
                  </h2>
                  <ExpenseForm
                    categories={categories}
                    showForm={true}
                    defaultDate={rawDate}
                  />
                </div>
              </Modal.Window>
            </Modal>
          )}
        </div>
      </div>

      <div
        className={`ml-3 flex flex-col gap-1 border-l-2 border-slate-100 pl-3 dark:border-slate-700 ${
          showExpense ? "block" : "hidden"
        }`}
      >
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
