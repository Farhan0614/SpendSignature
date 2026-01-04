import { useCategories } from "../categories/useCategories";
import ExpenseTable from "./ExpenseTable";

import Loader from "../../ui/Loader";
import NewExpense from "./NewExpense";

function ExpensesBody() {
  const { categories, isLoading } = useCategories();

  if (isLoading) return <Loader />;

  return (
    <>
      <NewExpense categories={categories} />
      <ExpenseTable />
    </>
  );
}

export default ExpensesBody;
