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
    // CHANGED: Responsive container logic
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 md:px-8">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-slate-900">
          <IoIosWallet className="h-8 w-8 text-indigo-600" />
          <Heading>Expenses</Heading>
        </div>

        {/* Nav is now flexible */}
        <div className="w-full overflow-x-auto pb-1 md:w-auto md:pb-0">
          <ExpenseNav />
        </div>
      </header>

      <ExpensesBody />
    </div>
  );
}

export default Expenses;
