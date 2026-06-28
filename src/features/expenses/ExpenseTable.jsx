import { format, parseISO } from "date-fns";
import { useSearchParams } from "react-router-dom";
import EmptyExpense from "../../ui/EmptyExpense";
import Loader from "../../ui/Loader";
import { useExpense } from "./useExpense";
import { useGetIncome } from "../wallet/useGetIncome";
import GroupExpenses from "./GroupExpenses";
import ExpenseRow from "./ExpenseRow";
import IncomeRow from "./IncomeRow";

function ExpenseTable() {
  const {
    expenses,
    isLoading: loadingExp,
    view,
    searchTerm,
    isSearching,
  } = useExpense();

  const { incomes, isLoading: loadingInc } = useGetIncome({
    enabled: !isSearching,
  });

  const [searchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "date-desc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  if (loadingExp || (!isSearching && loadingInc)) return <Loader />;

  let displayTransactions = [];

  if (isSearching) {
    displayTransactions = (expenses || []).map((e) => ({
      ...e,
      type: "expense",
      sortAmount: e.amount,
    }));
  } else {
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

    displayTransactions = [...normalizedExpenses, ...normalizedIncomes];
  }

  if (displayTransactions.length === 0) {
    return isSearching ? (
      <div className="mt-8 rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
          No matches found for "{searchTerm}"
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Try a title or note keyword. Search is global across all saved
          expenses.
        </p>
      </div>
    ) : (
      <EmptyExpense />
    );
  }

  const sortedTransactions = [...displayTransactions].sort((a, b) => {
    if (field === "amount") {
      return (a.sortAmount - b.sortAmount) * modifier;
    }
    return (new Date(a.date) - new Date(b.date)) * modifier;
  });

  if (isSearching) {
    return (
      <div className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-900/50">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-sm font-black tracking-widest text-slate-500 uppercase">
            Search Results
          </h3>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            {sortedTransactions.length} items
          </span>
        </div>

        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          Showing all-time matches for “{searchTerm}”
        </p>

        <div className="flex flex-col gap-1">
          {sortedTransactions.map((trx) => (
            <ExpenseRow expense={trx} key={`exp-${trx.id}`} />
          ))}
        </div>
      </div>
    );
  }

  if (field === "amount") {
    return (
      <div className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-900/50">
        <h3 className="mb-4 text-sm font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
          Ranked by Amount
        </h3>
        <div className="flex flex-col gap-1">
          {sortedTransactions.map((trx) =>
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

  const groupedData = {};
  sortedTransactions.forEach((trx) => {
    const key = view === "monthly" ? trx.date : trx.date.slice(0, 7);
    if (!groupedData[key]) groupedData[key] = [];
    groupedData[key].push(trx);
  });

  const groupedList = Object.entries(groupedData)
    .sort((a, b) => a[0].localeCompare(b[0]) * modifier)
    .map(([periodKey, items]) => {
      const prettyPeriod =
        view === "monthly"
          ? format(parseISO(periodKey), "MMM dd, yyyy")
          : format(parseISO(`${periodKey}-01`), "MMMM yyyy");

      const total = items.reduce((sum, trx) => {
        return sum + (trx.type === "expense" ? trx.sortAmount : 0);
      }, 0);

      return {
        period: prettyPeriod,
        rawDate: periodKey,
        transactions: items,
        total,
      };
    });

  return (
    <div className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-900/50">
      <div className="flex flex-col gap-2">
        {groupedList.map((group, index) => (
          <GroupExpenses groupExpenses={group} view={view} key={index} />
        ))}
      </div>
    </div>
  );
}

export default ExpenseTable;
