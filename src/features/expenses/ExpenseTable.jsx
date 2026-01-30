import { format, parseISO } from "date-fns";
import EmptyExpense from "../../ui/EmptyExpense";
import Loader from "../../ui/Loader";
import { useExpense } from "./useExpense";
import GroupExpenses from "./GroupExpenses";

function ExpenseTable() {
  const { expenses, isLoading, view } = useExpense();

  if (isLoading) return <Loader />;
  if (!expenses || expenses.length === 0) return <EmptyExpense />;

  let groupedData = {};

  // --- LOGIC 1: MONTHLY VIEW (Group by Day) ---
  if (view === "monthly") {
    groupedData = expenses.reduce((acc, exp) => {
      const dayKey = exp.date; // "2026-02-15"
      if (!acc[dayKey]) acc[dayKey] = [];
      acc[dayKey].push(exp);
      return acc;
    }, {});
  }
  // --- LOGIC 2: YEARLY VIEW (Group by Month) ---
  else {
    groupedData = expenses.reduce((acc, exp) => {
      // Extract YYYY-MM
      const monthKey = exp.date.slice(0, 7);
      if (!acc[monthKey]) acc[monthKey] = [];
      acc[monthKey].push(exp);
      return acc;
    }, {});
  }

  // Convert Object to Array for rendering
  // Object.entries returns [["2026-02-15", [...expenses]], ...]
  const groupedExpenses = Object.entries(groupedData)
    // Optional: Sort keys descending (newest first)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([periodKey, items]) => {
      let prettyPeriod;

      if (view === "monthly") {
        // Input: "2026-02-15" -> Output: "Feb 15, 2026"
        prettyPeriod = format(parseISO(periodKey), "MMM dd, yyyy");
      } else {
        // Input: "2026-02" -> Output: "February"
        prettyPeriod = format(parseISO(`${periodKey}-01`), "MMMM");
      }

      return {
        period: prettyPeriod,
        expenses: items,
        total: items.reduce((sum, exp) => sum + exp.amount, 0),
      };
    });

  return (
    <div className="mt-8">
      {groupedExpenses.map((group, index) => (
        <GroupExpenses groupExpenses={group} key={index} />
      ))}
    </div>
  );
}

export default ExpenseTable;
