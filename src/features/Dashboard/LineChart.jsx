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
import { format, subMonths, parseISO } from "date-fns";
import LoaderMini from "../../ui/LoaderMini";
import { useChartData } from "./useChartData";

function IncomeVsExpenseChart() {
  const { expenses, incomes, isLoading, anchorDate } = useChartData();

  if (isLoading)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-6 w-full text-left font-sans text-lg font-bold text-slate-700 opacity-50">
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
    <div className="w-full rounded-2xl bg-white shadow-sm">
      <h2 className="mb-6 font-sans text-lg font-bold text-slate-700">
        Income vs Expense (Last 6 Months)
      </h2>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
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
    </div>
  );
}

export default IncomeVsExpenseChart;
