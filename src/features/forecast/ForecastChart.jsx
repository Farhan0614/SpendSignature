import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { HiArrowTrendingUp, HiArrowTrendingDown } from "react-icons/hi2";
import { formatCurrency } from "../../utils/helpers";

function ForecastChart({ chartData, metrics, currency }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-6 text-lg font-bold text-slate-800 dark:text-white">
        Historical & Projected Cashflow
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#334155"
              opacity={0.2}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              width={80}
              tickFormatter={(val) => formatCurrency(val, currency)}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />

            <ReferenceLine
              x={chartData.find((d) => d.isPrediction)?.month}
              stroke="#8b5cf6"
              strokeDasharray="3 3"
              label={{
                position: "top",
                value: "Prediction Starts",
                fill: "#8b5cf6",
                fontSize: 12,
              }}
            />

            <Area
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorInc)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#ef4444"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorExp)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
          <HiArrowTrendingUp />
          <span>
            Income Growth: {metrics.incomeVelocity > 0 ? "+" : ""}
            {formatCurrency(metrics.incomeVelocity, currency)} /mo
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-400">
          <HiArrowTrendingDown />
          <span>
            Expense Growth: {metrics.expenseVelocity > 0 ? "+" : ""}
            {formatCurrency(metrics.expenseVelocity, currency)} /mo
          </span>
        </div>
      </div>
    </div>
  );
}

export default ForecastChart;
