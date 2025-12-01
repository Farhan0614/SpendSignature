import { useCategories } from "../categories/useCategories";
import ExpenseTable from "./ExpenseTable";

import Loader from "../../ui/Loader";
import NewExpense from "./NewExpense";
import { useMonthlyExpense } from "./useMonthlyExpense";
import { useUser } from "../authentication/useUser";

function ExpensesBody() {
  const { user } = useUser();
  const { categories, isLoading } = useCategories();
  const { monthlyExpense, isLoading: isLoading1 } = useMonthlyExpense(user.id);
  console.log(monthlyExpense);

  if (isLoading) return <Loader />;

  return (
    <>
      <NewExpense categories={categories} />
      <ExpenseTable />
    </>
  );
}

export default ExpensesBody;
