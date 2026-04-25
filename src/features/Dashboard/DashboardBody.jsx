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
import { useUser } from "../authentication/useUser";
import { HiPlus } from "react-icons/hi2";
import Button from "../../ui/Button";

function DashboardBody() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { user } = useUser();
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

  const displayName =
    profile?.full_name || user?.email?.split("@").at(0) || "there";

  // 3. PREPARE LISTS
  const formattedExpenses = recentExpenses.map((exp) => ({
    id: exp.id,
    type: "expense",
    title: exp.title || exp.categories?.name || "Expense",
    amount: exp.amount,
    date: new Date(exp.date),
    icon_name: exp.categories?.icon_name, // <--- ADD THIS
  }));

  const formattedIncomes = recentIncomes.map((inc) => ({
    id: inc.id,
    type: "income",
    title: inc.source || "Income Received",
    amount: inc.income,
    date: inc.date ? new Date(inc.date) : new Date(inc.created_at),
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Welcome back, {displayName}!
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Here is your financial overview for{" "}
            <span className="font-bold text-slate-700 dark:text-slate-200">
              {sentenceDate}
            </span>
            .
          </p>
        </div>

        {/* Right: Controls (Date Nav + Compact Buttons) */}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <DateNavigator />

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate("/wallet")}
              className="px-4 py-2"
            >
              <HiPlus className="h-4 w-4 text-emerald-500" /> Income
            </Button>

            <Button
              variant="primary"
              onClick={() => navigate("/expense")}
              className="px-4 py-2"
            >
              <HiPlus className="h-4 w-4" /> Expense
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 2: METRICS */}
      <section>
        <SummaryCards
          displayMonth={cardDate}
          totalBalance={currentBalance}
          monthlyBalance={monthlyBalance}
          monthlyExpense={totalMonthlyExpense}
        />
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm dark:border dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-900/50">
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
          <div className="rounded-2xl bg-white shadow-sm transition-transform hover:scale-[1.02] dark:border dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-900/50">
            <ExpenseBarChart
              income={monthlyBalance}
              expense={totalMonthlyExpense}
            />
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-sm dark:border dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-900/50">
            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
              Expense Breakdown
            </h2>
            <div className="w-full">
              <PieCharts monthlyExpense={monthExpenses} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardBody;
