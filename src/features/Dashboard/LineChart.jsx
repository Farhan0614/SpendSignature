import {
  AreaChart, // Changed from LineChart
  Area, // Changed from Line
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subMonths, parseISO } from "date-fns";
import LoaderMini from "../../ui/LoaderMini";
import { useChartData } from "./useChartData";
import { useDarkMode } from "../../context/DarkModeContext";

function IncomeVsExpenseChart() {
  const { expenses, incomes, isLoading, anchorDate } = useChartData();
  const { isDarkMode } = useDarkMode(); // <--- 1. Get Mode

  const chartColors = isDarkMode
    ? {
        grid: "#334155", // slate-700
        text: "#94a3b8", // slate-400
        tooltipBg: "#1e293b", // slate-800
        tooltipBorder: "#334155", // slate-700
        tooltipText: "#f8fafc", // slate-50
      }
    : {
        grid: "#e2e8f0", // slate-200
        text: "#64748b", // slate-500
        tooltipBg: "#ffffff",
        tooltipBorder: "#f1f5f9",
        tooltipText: "#1e293b",
      };

  if (isLoading)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
        <h2 className="mb-6 w-full text-left font-sans text-lg font-bold text-slate-700 opacity-50 dark:text-slate-400">
          Income vs Expense
        </h2>
        <div className="flex h-[300px] w-full items-center justify-center">
          <LoaderMini />
        </div>
      </div>
    );

  const chartData = [];
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(anchorDate, i);
    chartData.push({
      name: format(date, "MMM"),
      key: format(date, "yyyy-MM"),
      income: 0,
      expense: 0,
    });
  }

  expenses?.forEach((exp) => {
    if (!exp.date) return; // Safety check
    const key = format(parseISO(exp.date), "yyyy-MM");
    const bucket = chartData.find((d) => d.key === key);
    if (bucket) bucket.expense += exp.amount;
  });

  incomes?.forEach((inc) => {
    if (!inc.date) return; // Safety check

    // FIX: Changed parseISO(inc.created_at) to parseISO(inc.date)
    const key = format(parseISO(inc.date), "yyyy-MM");

    const bucket = chartData.find((d) => d.key === key);
    if (bucket) bucket.income += inc.income;
  });

  return (
    <div className="w-full rounded-2xl bg-white shadow-sm dark:bg-slate-900">
      <h2 className="mb-6 font-sans text-lg font-bold text-slate-700 dark:text-slate-200">
        Income vs Expense (Last 6 Months)
      </h2>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            {/* 1. DEFINE GRADIENTS FOR GLASS EFFECT */}
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />

            <XAxis
              dataKey="name"
              tick={{ fill: chartColors.text, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: chartColors.text, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}`}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: chartColors.tooltipBg,
                borderColor: chartColors.tooltipBorder,
                color: chartColors.tooltipText,
                borderRadius: "12px", // Increased radius for glassy feel
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              itemStyle={{ color: chartColors.tooltipText }}
            />

            {/* 2. AREAS INSTEAD OF LINES */}
            <Area
              type="monotone" // Use "monotone" or "natural" for fluid curves
              dataKey="income"
              name="Income"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorIncome)" // References the gradient above
              dot={false} // Removes the dots for a fluid look
              activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981" }} // Glow effect on hover
            />

            <Area
              type="monotone"
              dataKey="expense"
              name="Expense"
              stroke="#ef4444"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorExpense)" // References the gradient above
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0, fill: "#ef4444" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default IncomeVsExpenseChart;
