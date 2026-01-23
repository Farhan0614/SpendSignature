import { FaAd, FaCalendar, FaHashtag } from "react-icons/fa";
import ExpenseList from "./ExpenseList";

function CategoryTable({ categoryExpenses }) {
  const count = categoryExpenses?.length || 0;

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* HEADER */}
      <div className="grid grid-cols-3 border-b border-slate-100 bg-slate-50/50 px-6 py-4 text-xs font-bold tracking-wider text-slate-500 uppercase">
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
      {count > 0 ? (
        <div className="divide-y divide-slate-100">
          {categoryExpenses.map((expense) => (
            <ExpenseList key={expense.id} expense={expense} />
          ))}
        </div>
      ) : (
        <div className="flex h-32 items-center justify-center font-medium text-slate-400">
          No transactions found
        </div>
      )}

      {/* FOOTER */}
      <div className="bg-slate-50 px-6 py-3 text-center text-xs font-medium text-slate-400">
        Total Records: {count}
      </div>
    </div>
  );
}

export default CategoryTable;
