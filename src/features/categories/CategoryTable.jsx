import { FaAd, FaCalendar, FaHashtag } from "react-icons/fa";
import ExpenseList from "./ExpenseList";

function CategoryTable({ categoryExpenses }) {
  const count = categoryExpenses?.length;

  return (
    <>
      <div>
        <header className="border-b border-slate-200 pb-3 text-slate-500">
          <div></div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-semibold">
              <FaCalendar className="text-slate-400" /> Date
            </span>
            <span className="flex items-center gap-2 font-semibold">
              <FaAd className="text-slate-400" /> Name
            </span>
            <span className="flex items-center gap-2 font-semibold">
              <FaHashtag className="text-slate-400" /> Amount
            </span>
          </div>
        </header>

        {categoryExpenses.length > 0 && categoryExpenses ? (
          <div className="mb-3">
            {categoryExpenses.map((expense) => (
              <ExpenseList key={expense.id} expense={expense} />
            ))}
          </div>
        ) : (
          <p className="text-lg font-semibold text-slate-400">Empty</p>
        )}
        <footer className="font-space text-center text-sm text-slate-400">
          COUNT {count}
        </footer>
      </div>
    </>
  );
}

export default CategoryTable;
