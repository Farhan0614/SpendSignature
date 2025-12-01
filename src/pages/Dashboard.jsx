import { useUser } from "../features/authentication/useUser";
import SummaryCards from "../features/Dashboard/SummaryCards";
import { useTotalBalance } from "../features/wallet/useTotalBalance";
import Redirect from "../ui/Redirect";
import Loader from "../ui/Loader";
import { useMonthlyBalance } from "../features/wallet/useMonthlyBalance";
import { useMonthlyExpense } from "../features/expenses/useMonthlyExpense";
import LineChart from "../features/Dashboard/LineChart";
import PieCharts from "../features/Dashboard/PieChart";
import ExpenseBarChart from "../features/Dashboard/ExpenseBarChart";
import { useCategories } from "../features/categories/useCategories";

function Dashboard() {
  const { user, isAuthenticated } = useUser();
  const { totalBalance, isLoading: isTotalLoading } = useTotalBalance(user?.id);
  const { monthlyBalance, isLoading: isMonthlyLoading } = useMonthlyBalance(
    user?.id,
  );
  const { monthlyExpense, isLoading: isMonthlyExpLoading } = useMonthlyExpense(
    user?.id,
  );

  const totalMonthlyExpense =
    monthlyExpense?.reduce((sum, item) => sum + item.amount, 0) || 0;

  if (user === null || !isAuthenticated)
    return <Redirect pageName="dashboard" />;

  if (isTotalLoading || isMonthlyLoading || isMonthlyExpLoading)
    return <Loader />;

  return (
    <>
      <section className="grid grid-cols-1 gap-10 px-6 py-10 md:grid-cols-2 lg:gap-12 lg:px-12">
        {/* === 1. HERO TEXT === */}
        <div className="flex flex-col justify-center text-center md:text-left">
          <h1 className="text-4xl font-bold text-slate-600 md:text-5xl">
            Take Control of Your Finances
          </h1>
          <p className="mx-auto mt-4 max-w-md text-xl text-slate-700 md:mx-0">
            Smart budgeting, effortless tracking, and clear insights — all in
            one place.
          </p>
          <button className="mt-8 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-3 font-semibold text-white shadow-md transition-all hover:from-indigo-600 hover:to-blue-600">
            Add Transaction
          </button>
        </div>

        {/* === 2. PIE CHART === */}
        <div className="flex flex-col items-center justify-center">
          <h2 className="mb-4 text-lg font-bold text-slate-500">
            Expense Breakdown by Category
          </h2>
          <div className="h-[300px] w-[300px] md:h-[350px] md:w-[350px]">
            <PieCharts monthlyExpense={monthlyExpense} />
          </div>
        </div>

        {/* === 3. SUMMARY CARDS === */}
        <div className="col-span-1 flex items-center justify-center">
          <SummaryCards
            totalBalance={totalBalance}
            monthlyBalance={monthlyBalance}
            monthlyExpense={totalMonthlyExpense}
          />
        </div>

        {/* === 4. PLACEHOLDER FOR FUTURE ITEM === */}
        <div className="rounded-2x flex items-center justify-center text-slate-400">
          <LineChart />
        </div>
      </section>

      <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
        {/* === MIDDLE SECTION: CHART AREA === */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex items-center justify-center text-gray-400">
            <ExpenseBarChart
              income={monthlyBalance}
              expense={totalMonthlyExpense}
            />
          </div>
        </section>
      </div>
    </>
  );
}

export default Dashboard;
