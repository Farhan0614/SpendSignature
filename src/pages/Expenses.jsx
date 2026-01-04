import ExpenseNav from "../features/expenses/ExpenseNav";
import ExpensesBody from "../features/expenses/ExpensesBody";
import { IoIosWallet } from "react-icons/io";
import Heading from "../ui/Heading";
import { useUser } from "../features/authentication/useUser";
import Redirect from "../ui/Redirect";

function Expenses() {
  const { user, isAuthenticated } = useUser();
  if (user === null || !isAuthenticated)
    return <Redirect pageName="expenses" />;

  return (
    <div className="mt-4 space-y-6 px-18">
      <header className="space-y-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2 text-slate-900">
          <IoIosWallet className="h-7 w-7" />
          <Heading>Expenses</Heading>
        </div>
        <div>
          <ExpenseNav />
        </div>
      </header>

      <ExpensesBody />
    </div>
  );
}

export default Expenses;
