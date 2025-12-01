import { useSearchParams } from "react-router-dom";
import { format, parseISO } from "date-fns";

import EmptyExpense from "../../ui/EmptyExpense";
import Loader from "../../ui/Loader";
import Modal from "../../ui/Modal";
import { useExpense } from "./useExpense";
import GroupExpenses from "./GroupExpenses";

function ExpenseTable() {
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view") || "daily";

  const { expenses, isLoading } = useExpense();
  if (isLoading) return <Loader />;
  if (expenses.length === 0) return <EmptyExpense />;
  console.log(expenses);

  let data = {};

  if (view === "daily") {
    const groupedByDay = expenses.reduce((acc, exp) => {
      const dayKey = exp.date;

      if (!acc[dayKey]) acc[dayKey] = [];
      acc[dayKey].push(exp);

      return acc;
    }, {});

    data = groupedByDay;
  }

  if (view === "monthly") {
    const groupedByMonth = expenses.reduce((acc, exp) => {
      const monthKey = exp.date.slice(0, 7); // e.g., 2025-08

      if (!acc[monthKey]) acc[monthKey] = [];
      acc[monthKey].push(exp);

      return acc;
    }, {});

    data = groupedByMonth;
  }

  if (view === "yearly") {
    const groupedByYear = expenses.reduce((acc, exp) => {
      const yearKey = exp.date.slice(0, 4); // e.g., 2025

      if (!acc[yearKey]) acc[yearKey] = [];
      acc[yearKey].push(exp);

      return acc;
    }, {});

    data = groupedByYear;
  }

  const groupedExpenses = Object.entries(data).map(([period, expenses]) => {
    let prettyPeriod;

    if (view === "daily") {
      prettyPeriod = format(parseISO(period), "MMM dd, yyyy");
    } else if (view === "monthly") {
      prettyPeriod = format(parseISO(`${period}-01`), "MMM yyyy");
    } else if (view === "yearly") {
      prettyPeriod = format(parseISO(`${period}-01-01`), "yyyy");
    }

    return {
      period: prettyPeriod,
      expenses,
      total: expenses.reduce((sum, exp) => sum + exp.amount, 0),
    };
  });
  console.log(groupedExpenses);

  return (
    <Modal>
      <div>
        {groupedExpenses.map((groupExpenses, key) => (
          <GroupExpenses groupExpenses={groupExpenses} key={key} />
        ))}
      </div>
    </Modal>
  );
}

export default ExpenseTable;
