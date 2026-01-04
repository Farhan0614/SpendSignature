import { useNavigate } from "react-router-dom";
import { useUser } from "../authentication/useUser";
import SummaryCards from "./SummaryCards";
import Redirect from "../../ui/Redirect";
import Loader from "../../ui/Loader";
import LineChart from "./LineChart";
import PieCharts from "./PieChart";
import ExpenseBarChart from "./ExpenseBarChart";
import RecentTransactions from "./RecentTransactions";
import { useExpense } from "../expenses/useExpense";
import { useGetIncome } from "../wallet/useGetIncome";

function DashboardBody() {
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();

  const { expenses, isLoading: loadingExpenses } = useExpense();
  const { incomes, isLoading: loadingIncomes } = useGetIncome();

  if (user === null || !isAuthenticated)
    return <Redirect pageName="dashboard" />;
  if (loadingExpenses || loadingIncomes) return <Loader />;

  // --- EXISTING LOGIC ---
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const totalBalance =
    incomes?.reduce((sum, item) => sum + item.income, 0) || 0;

  const monthlyBalance =
    incomes
      ?.filter(
        (item) => item.month === currentMonth && item.year === currentYear,
      )
      .reduce((sum, item) => sum + item.income, 0) || 0;

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

  // --- NEW LOGIC: COMBINE TRANSACTIONS ---

  // 1. Normalize Expenses
  const formattedExpenses =
    expenses?.map((exp) => ({
      id: exp.id,
      type: "expense",
      title: exp.title || exp.categories?.name || "Expense",
      amount: exp.amount,
      date: new Date(exp.date), // Ensure it's a Date object
    })) || [];

  // 2. Normalize Incomes
  // Note: Your wallet table might use 'created_at'. If not, we construct date from year/month
  const formattedIncomes =
    incomes?.map((inc) => {
      // Construct a date. If you have created_at, use that.
      // If only month/year, default to the 1st of that month.
      const dateObj = inc.created_at
        ? new Date(inc.created_at)
        : new Date(inc.year, inc.month - 1, 1);

      return {
        id: inc.id,
        type: "income",
        title: "Income Added",
        amount: inc.income,
        date: dateObj,
      };
    }) || [];

  // 3. Merge, Sort, and Slice
  const allTransactions = [...formattedExpenses, ...formattedIncomes]
    .sort((a, b) => b.date - a.date) // Sort by date descending (newest first)
    .slice(0, 5); // Take top 5

  // ---------------------------------------

  return (
    <div className="space-y-8">
      {/* SECTION 1: WELCOME & ACTIONS */}
      <section className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {user?.email?.split("@")[0]}!
          </h1>
          <p className="mt-1 text-slate-500">
            Here is your financial overview for {new Date().getFullYear()}.
          </p>
        </div>
        <button
          onClick={() => navigate("/expense")}
          className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md"
        >
          + Add Transaction
        </button>
      </section>

      {/* SECTION 2: SUMMARY CARDS */}
      <section>
        <SummaryCards
          totalBalance={totalBalance}
          monthlyBalance={monthlyBalance}
          monthlyExpense={totalMonthlyExpense}
        />
      </section>

      {/* SECTION 3: THE MAIN GRID */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* === LEFT COLUMN (2/3 width) === */}
        {/* Best for wide charts and lists */}
        <div className="flex flex-col gap-8 lg:col-span-2">
          {/* 1. Line Chart (Income vs Expense) */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <LineChart />
          </div>

          {/* 2. Recent Transactions */}
          {/* Moving this to the left gives it more breathing room to read details */}
          <RecentTransactions transactions={allTransactions} />
        </div>

        {/* === RIGHT COLUMN (1/3 width) === */}
        {/* Best for "Widgets" and Status Indicators */}
        <div className="flex flex-col gap-8">
          {/* 3. Monthly Spending Progress (MOVED HERE) */}
          {/* Now it sits at the top right as a "Budget Health" indicator */}
          <div className="rounded-2xl bg-white shadow-sm transition-transform hover:scale-[1.02]">
            <ExpenseBarChart
              income={monthlyBalance}
              expense={totalMonthlyExpense}
            />
          </div>

          {/* 4. Pie Chart (Expense Breakdown) */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-bold text-slate-700">
              Expense Breakdown
            </h2>
            <div className="h-[250px] w-full">
              <PieCharts monthlyExpense={monthlyExpenseData} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardBody;
