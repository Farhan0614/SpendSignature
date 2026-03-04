import { FaAd, FaCalendar, FaHashtag } from "react-icons/fa";
import ExpenseList from "./ExpenseList";

function CategoryTable({ categoryExpenses, count, isLoadingList }) {
  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-900/50">
      {/* HEADER */}
      <div className="grid grid-cols-3 border-b border-slate-100 bg-slate-50/50 px-6 py-4 text-xs font-bold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <FaCalendar /> Date
        </div>
        <div className="flex items-center gap-2">
          <FaAd /> Description
        </div>
        <div className="flex items-center justify-end gap-2">
          <FaHashtag /> Amount
        </div>
      </div>

      {/* BODY */}
      <div className="h-[320px] divide-y divide-slate-100 dark:divide-slate-800">
        {isLoadingList ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent dark:border-indigo-400"></div>
          </div>
        ) : count > 0 ? (
          categoryExpenses.map((expense) => (
            <ExpenseList key={expense.id} expense={expense} />
          ))
        ) : (
          <div className="flex h-full items-center justify-center font-medium text-slate-400">
            No transactions found
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="bg-slate-50 px-6 py-3 text-center text-xs font-medium text-slate-400 dark:bg-slate-800/50 dark:text-slate-500">
        Total Records: {count}
      </div>
    </div>
  );
}

export default CategoryTable;
