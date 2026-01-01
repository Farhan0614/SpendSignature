import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subMonths, parseISO, isSameMonth } from "date-fns";
import { useExpense } from "../expenses/useExpense";
import { useGetIncome } from "../wallet/useGetIncome";
import LoaderMini from "../../ui/LoaderMini";

function IncomeVsExpenseChart() {
  const { expenses, isLoading: loadingExpenses } = useExpense();
  const { incomes, isLoading: loadingIncome } = useGetIncome();

  if (loadingExpenses || loadingIncome)
    return (
      <div className="flex h-[300px] items-center justify-center">
        <LoaderMini />
      </div>
    );

  // 1. GENERATE LAST 6 MONTHS LABELS (The "Skeleton")
  // We go back 5 months + current month = 6 months total
  const chartData = [];
  const today = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = subMonths(today, i);
    chartData.push({
      // Label for the X-Axis (e.g., "Aug", "Sep")
      name: format(date, "MMM"),
      // Unique key to match data (e.g., "2025-08")
      key: format(date, "yyyy-MM"),
      income: 0,
      expense: 0,
    });
  }

  // 2. FILL EXPENSES
  // Loop through all expenses and add them if they match one of our 6 months
  expenses?.forEach((expense) => {
    const expenseDate = parseISO(expense.date);
    const expenseKey = format(expenseDate, "yyyy-MM");

    // Find the month in our chartData that matches this expense
    const monthData = chartData.find((d) => d.key === expenseKey);

    if (monthData) {
      monthData.expense += expense.amount;
    }
  });

  // 3. FILL INCOME
  // Income has separate 'year' and 'month' columns (integers)
  incomes?.forEach((inc) => {
    // Format income year/month to match our key (e.g., 2025-09)
    // padStart ensures "9" becomes "09"
    const incomeKey = `${inc.year}-${String(inc.month).padStart(2, "0")}`;

    const monthData = chartData.find((d) => d.key === incomeKey);

    if (monthData) {
      monthData.income += inc.income;
    }
  });

  return (
    <div className="w-full rounded-2xl bg-white p-4 shadow-sm">
      <h2 className="mb-6 font-sans text-lg font-bold text-slate-700">
        Income vs Expense (Last 6 Months)
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Legend wrapperStyle={{ paddingTop: "20px" }} />

          <Line
            type="monotone"
            dataKey="income"
            name="Income"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 4, fill: "#10b981" }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="expense"
            name="Expense"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ r: 4, fill: "#ef4444" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default IncomeVsExpenseChart;
