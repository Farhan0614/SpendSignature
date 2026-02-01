import { useNavigate } from "react-router-dom";
import { format, isSameMonth } from "date-fns"; // 1. Import isSameMonth
import SummaryCards from "./SummaryCards";
import Loader from "../../ui/Loader";
import LineChart from "./LineChart";
import PieCharts from "./PieChart";
import ExpenseBarChart from "./ExpenseBarChart";
import RecentTransactions from "./RecentTransactions";
import DateNavigator from "../../ui/DateNavigator";

import { useDashboardData } from "./useDashboardData";
import { useBalanceData } from "../wallet/useBalanceData";
import { useProfile } from "../settings/useProfile";

function DashboardBody() {
  const navigate = useNavigate();
  const { profile } = useProfile();

  // 1. DATA FETCHING
  const {
    recentExpenses,
    recentIncomes,
    monthExpenses,
    monthIncomes,
    isLoading,
    currentMonth,
  } = useDashboardData();

  const { currentBalance, isLoading: loadingBalance } = useBalanceData();

  if (isLoading || loadingBalance) return <Loader />;

  // 2. MONTHLY TOTALS
  const monthlyBalance = monthIncomes.reduce(
    (sum, item) => sum + item.income,
    0,
  );
  const totalMonthlyExpense = monthExpenses.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  // 3. PREPARE LISTS
  const formattedExpenses = recentExpenses.map((exp) => ({
    id: exp.id,
    type: "expense",
    title: exp.title || exp.categories?.name || "Expense",
    amount: exp.amount,
    date: new Date(exp.date),
  }));

  const formattedIncomes = recentIncomes.map((inc) => ({
    id: inc.id,
    type: "income",
    title: "Income Received",
    amount: inc.income,
    date: inc.created_at ? new Date(inc.created_at) : new Date(),
  }));

  // --- 4. NEW DATE LOGIC ---
  const selectedDate = new Date(`${currentMonth}-01`);
  const today = new Date();
  const isCurrent = isSameMonth(selectedDate, today);

  // Text for the "Welcome" sentence (lowercase flows better)
  const sentenceDate = isCurrent
    ? "this month"
    : format(selectedDate, "MMMM yyyy");

  // Text for the Cards (Title Case looks better in widgets)
  const cardDate = isCurrent ? "This Month" : format(selectedDate, "MMMM yyyy");

  return (
    <div className="space-y-8">
      {/* SECTION 1: WELCOME & CONTROLS */}
      <section className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Left: Text */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back,{" "}
            {profile.full_name ? profile.full_name.split(" ")[0] : "User"}!
          </h1>
          <p className="mt-1 text-slate-500">
            Here is your financial overview for{" "}
            <span className="font-bold text-slate-700">{sentenceDate}</span>.
          </p>
        </div>

        {/* Right: Controls (Date Nav + Add Button) */}
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <DateNavigator />

          <button
            onClick={() => navigate("/expense")}
            className="cursor-pointer rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md"
          >
            + Add Transaction
          </button>
        </div>
      </section>

      {/* SECTION 2: METRICS */}
      <section>
        <SummaryCards
          displayMonth={cardDate} // Pass the Card specific text
          totalBalance={currentBalance}
          monthlyBalance={monthlyBalance}
          monthlyExpense={totalMonthlyExpense}
        />
      </section>

      {/* ... rest of the code remains the same ... */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* ... */}
        <div className="flex flex-col gap-8 lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <LineChart />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <RecentTransactions
              title="Recent Expenses"
              transactions={formattedExpenses}
            />
            <RecentTransactions
              title="Recent Incomes"
              transactions={formattedIncomes}
            />
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="rounded-2xl bg-white shadow-sm transition-transform hover:scale-[1.02]">
            <ExpenseBarChart
              income={monthlyBalance}
              expense={totalMonthlyExpense}
            />
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-bold text-slate-700">
              Expense Breakdown
            </h2>
            <div className="h-[250px] w-full">
              <PieCharts monthlyExpense={monthExpenses} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardBody;
