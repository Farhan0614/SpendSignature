import { IoIosWallet } from "react-icons/io";
import Heading from "../ui/Heading";
import { useUser } from "../features/authentication/useUser";
import Redirect from "../ui/Redirect";
import ExpensesBody from "../features/expenses/ExpensesBody";
import ExpenseNav from "../features/expenses/ExpenseNav";

function Expenses() {
  const { user, isAuthenticated } = useUser();

  if (user === null || !isAuthenticated)
    return <Redirect pageName="expenses" />;

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-4 xl:flex-row xl:items-center xl:justify-between">
        {/* Left: Title */}
        <div className="flex items-center gap-2 text-slate-900">
          <IoIosWallet className="h-8 w-8 text-indigo-600" />
          <Heading>Expenses</Heading>
        </div>

        <div className="w-full overflow-x-auto pb-1 md:w-auto md:pb-0">
          <ExpenseNav />
        </div>
      </header>

      {/* BODY SECTION */}
      <ExpensesBody />
    </div>
  );
}

export default Expenses;
