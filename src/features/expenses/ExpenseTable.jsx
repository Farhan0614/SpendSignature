import { format, parseISO } from "date-fns";
import { useSearchParams } from "react-router-dom";
import EmptyExpense from "../../ui/EmptyExpense";
import Loader from "../../ui/Loader";
import { useExpense } from "./useExpense";
import GroupExpenses from "./GroupExpenses";
import ExpenseRow from "./ExpenseRow";

function ExpenseTable() {
  const { expenses, isLoading, view } = useExpense();
  const [searchParams] = useSearchParams();

  const sortBy = searchParams.get("sortBy") || "date-desc";
  const [field, direction] = sortBy.split("-");

  // 1. Determine Modifier (1 for Ascending, -1 for Descending)
  const modifier = direction === "asc" ? 1 : -1;

  if (isLoading) return <Loader />;
  if (!expenses || expenses.length === 0) return <EmptyExpense />;

  // --- SCENARIO 1: SORT BY AMOUNT (FLAT VIEW) ---
  if (field === "amount") {
    const sortedExpenses = expenses.slice().sort((a, b) => {
      return (a.amount - b.amount) * modifier;
    });

    return (
      <div className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8">
        <h3 className="mb-4 text-sm font-bold tracking-wider text-slate-500 uppercase">
          Ranked by Amount
        </h3>
        <div className="flex flex-col gap-1">
          {sortedExpenses.map((expense) => (
            <ExpenseRow expense={expense} key={expense.id} />
          ))}
        </div>
      </div>
    );
  }

  // --- SCENARIO 2: SORT BY DATE (GROUPED VIEW) ---
  let groupedData = {};

  if (view === "monthly") {
    groupedData = expenses.reduce((acc, exp) => {
      const dayKey = exp.date;
      if (!acc[dayKey]) acc[dayKey] = [];
      acc[dayKey].push(exp);
      return acc;
    }, {});
  } else {
    groupedData = expenses.reduce((acc, exp) => {
      const monthKey = exp.date.slice(0, 7);
      if (!acc[monthKey]) acc[monthKey] = [];
      acc[monthKey].push(exp);
      return acc;
    }, {});
  }

  const groupedExpenses = Object.entries(groupedData)
    // 2. Sort the Groups (e.g., January vs February)
    .sort((a, b) => {
      return a[0].localeCompare(b[0]) * modifier;
    })
    .map(([periodKey, items]) => {
      // 3. FIX: Sort the Items INSIDE the group (e.g., Jan 1st vs Jan 5th)
      const sortedItems = items.sort((a, b) => {
        return (new Date(a.date) - new Date(b.date)) * modifier;
      });

      let prettyPeriod;
      if (view === "monthly") {
        prettyPeriod = format(parseISO(periodKey), "MMM dd, yyyy");
      } else {
        prettyPeriod = format(parseISO(`${periodKey}-01`), "MMMM");
      }

      return {
        period: prettyPeriod,
        expenses: sortedItems, // Use the sorted list
        total: items.reduce((sum, exp) => sum + exp.amount, 0),
      };
    });

  return (
    <div className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8">
      <div className="flex flex-col gap-2">
        {groupedExpenses.map((group, index) => (
          <GroupExpenses groupExpenses={group} key={index} />
        ))}
      </div>
    </div>
  );
}

export default ExpenseTable;
