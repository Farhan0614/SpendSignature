import { format, parseISO } from "date-fns";
import { useSearchParams } from "react-router-dom";
import EmptyExpense from "../../ui/EmptyExpense";
import Loader from "../../ui/Loader";
import { useExpense } from "./useExpense";
import { useGetIncome } from "../wallet/useGetIncome";
import GroupExpenses from "./GroupExpenses";
import ExpenseRow from "./ExpenseRow";

function ExpenseTable() {
  const { expenses, isLoading: loadingExp, view } = useExpense();
  const { incomes, isLoading: loadingInc } = useGetIncome();
  const [searchParams] = useSearchParams();

  const sortBy = searchParams.get("sortBy") || "date-desc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  if (loadingExp || loadingInc) return <Loader />;

  // --- NORMALIZE DATA ---
  const normalizedExpenses = (expenses || []).map((e) => ({
    ...e,
    type: "expense",
    sortAmount: e.amount,
  }));

  const normalizedIncomes = (incomes || []).map((i) => ({
    ...i,
    type: "income",
    sortAmount: i.income,
  }));

  const allTransactions = [...normalizedExpenses, ...normalizedIncomes];

  // Global Empty Check
  if (allTransactions.length === 0) return <EmptyExpense />;

  // --- SCENARIO 1: SORT BY AMOUNT (EXPENSES ONLY) ---
  if (field === "amount") {
    // 💡 Filter out incomes when sorting by amount
    const onlyExpenses = allTransactions.filter(
      (trx) => trx.type === "expense",
    );

    const sortedExpenses = onlyExpenses.sort((a, b) => {
      return (a.sortAmount - b.sortAmount) * modifier;
    });

    return (
      <div className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8">
        <h3 className="mb-4 text-sm font-bold tracking-wider text-slate-500 uppercase">
          Ranked by Amount
        </h3>
        <div className="flex flex-col gap-1">
          {sortedExpenses.map((expense) => (
            <ExpenseRow expense={expense} key={`exp-${expense.id}`} />
          ))}
        </div>
      </div>
    );
  }

  // --- SCENARIO 2: SORT BY DATE (TIMELINE - BOTH INCOMES & EXPENSES) ---
  let groupedData = {};

  // Group by exact date (monthly view) or by month (yearly view)
  allTransactions.forEach((trx) => {
    const key = view === "monthly" ? trx.date : trx.date.slice(0, 7);
    if (!groupedData[key]) groupedData[key] = [];
    groupedData[key].push(trx);
  });

  const groupedExpenses = Object.entries(groupedData)
    .sort((a, b) => a[0].localeCompare(b[0]) * modifier)
    .map(([periodKey, items]) => {
      // Sort items INSIDE the group by exact date
      const sortedItems = items.sort((a, b) => {
        return (new Date(a.date) - new Date(b.date)) * modifier;
      });

      let prettyPeriod =
        view === "monthly"
          ? format(parseISO(periodKey), "MMM dd, yyyy")
          : format(parseISO(`${periodKey}-01`), "MMMM yyyy");

      const total = items.reduce((sum, trx) => {
        return sum + (trx.type === "expense" ? trx.sortAmount : 0);
      }, 0);

      return {
        period: prettyPeriod,
        transactions: sortedItems,
        total, // Pass the mathematically correct total
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
