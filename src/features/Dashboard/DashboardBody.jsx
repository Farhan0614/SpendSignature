import { useUser } from "../authentication/useUser";
import SummaryCards from "./SummaryCards";
import Redirect from "../../ui/Redirect";
import Loader from "../../ui/Loader";
import LineChart from "./LineChart";
import PieCharts from "./PieChart";
import ExpenseBarChart from "./ExpenseBarChart";

// 1. We import the "Master" hooks that fetch ALL data
import { useExpense } from "../expenses/useExpense";
import { useGetIncome } from "../wallet/useGetIncome";

function DashboardBody() {
  const { user, isAuthenticated } = useUser();

  // 2. Fetch DATA only (Not pre-calculated totals)
  const { expenses, isLoading: loadingExpenses } = useExpense();
  const { incomes, isLoading: loadingIncomes } = useGetIncome();

  if (user === null || !isAuthenticated)
    return <Redirect pageName="dashboard" />;
  if (loadingExpenses || loadingIncomes) return <Loader />;

  // 3. DERIVE STATE (Calculate totals right here in the component)
  // ---------------------------------------------------------

  // A. Helpers for dates
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const currentYear = new Date().getFullYear();

  // B. Calculate Income Stats (Replaces useTotalBalance & useMonthlyBalance)
  const totalBalance =
    incomes?.reduce((sum, item) => sum + item.income, 0) || 0;

  const monthlyBalance =
    incomes
      ?.filter(
        (item) => item.month === currentMonth && item.year === currentYear,
      )
      .reduce((sum, item) => sum + item.income, 0) || 0;

  // C. Calculate Expense Stats (Replaces useMonthlyExpense)
  const totalMonthlyExpense =
    expenses
      ?.filter((item) => {
        const d = new Date(item.date);
        return (
          d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear
        );
      })
      .reduce((sum, item) => sum + item.amount, 0) || 0;

  const monthlyExpenseData = expenses?.filter((item) => {
    const d = new Date(item.date);
    return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
  });

  // ---------------------------------------------------------

  return (
    <>
      <section className="grid grid-cols-1 gap-10 px-6 py-10 md:grid-cols-2 lg:gap-12 lg:px-12">
        {/* HERO TEXT */}
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

        {/* PIE CHART - Passed filtered "monthlyExpenseData" */}
        <div className="flex flex-col items-center justify-center">
          <h2 className="mb-4 text-lg font-bold text-slate-500">
            Expense Breakdown by Category
          </h2>
          <div className="h-[300px] w-[300px] md:h-[350px] md:w-[350px]">
            <PieCharts monthlyExpense={monthlyExpenseData} />
          </div>
        </div>

        {/* SUMMARY CARDS - Uses calculated values */}
        <div className="col-span-1 flex items-center justify-center">
          <SummaryCards
            totalBalance={totalBalance}
            monthlyBalance={monthlyBalance}
            monthlyExpense={totalMonthlyExpense}
          />
        </div>

        {/* LINE CHART - Uses the hooks internally, which React Query will dedup! */}
        <div className="rounded-2x flex items-center justify-center text-slate-400">
          <LineChart />
        </div>
      </section>

      <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
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

export default DashboardBody;
