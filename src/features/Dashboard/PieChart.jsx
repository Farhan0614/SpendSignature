import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useCurrency } from "../../context/CurrencyContext";
import { formatCurrency } from "../../utils/helpers";

const CATEGORY_COLORS = {
  "Food & Groceries": "#10B981",
  Transport: "#F59E0B",
  Shopping: "#6366F1",
  Entertainment: "#EF4444",
  "Health & Self Care": "#06B6D4",
  "Bills & Utilities": "#3B82F6",
  Travel: "#8B5CF6",
  Education: "#84CC16",
  Housing: "#F97316",
  Financial: "#14B8A6",
  Others: "#A855F7",
};

function PieCharts({ monthlyExpense = [] }) {
  const { currency } = useCurrency();

  // 1. Prepare Data
  const data =
    monthlyExpense.length > 0
      ? monthlyExpense.reduce((acc, exp) => {
          if (!exp?.categories?.name) return acc;
          const existing = acc.find(
            (item) => item.name === exp.categories.name,
          );
          if (existing) existing.value += exp.amount;
          else acc.push({ name: exp.categories.name, value: exp.amount });
          return acc;
        }, [])
      : [];

  // 2. Calculate Total
  const totalAmount = data.reduce((sum, item) => sum + item.value, 0);

  // 3. Sort (Big slices first)
  const sortedData = data.sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="flex h-48 w-full flex-col items-center justify-center text-slate-400">
        <p className="text-sm font-medium">No data yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* --- PART 1: THE CHART --- */}
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sortedData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={4}
              cornerRadius={4}
              dataKey="value"
              nameKey="name"
              stroke="none"
            >
              {sortedData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={CATEGORY_COLORS[entry.name] || "#CBD5E1"}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(value, currency)}
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              itemStyle={{
                color: "#334155",
                fontSize: "12px",
                fontWeight: "600",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* --- PART 2: THE LEGEND (FIXED 2-COLUMNS) --- */}
      {/* 1. 'grid-cols-2': Always 2 columns.
          2. 'gap-x-4': Little more space between columns for readability.
          3. 'truncate': Prevents long names from breaking the layout.
      */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-2">
        {sortedData.map((item) => {
          const percent = ((item.value / totalAmount) * 100).toFixed(0);
          const color = CATEGORY_COLORS[item.name] || "#94a3b8";

          return (
            <div
              key={item.name}
              title={item.name}
              className="flex items-center gap-2 text-xs"
            >
              {/* The Dot */}
              <div
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
              />

              {/* The Text */}
              <div className="flex min-w-0 items-center gap-1 font-semibold">
                <span className="truncate" style={{ color: color }}>
                  {item.name}
                </span>
                <span className="shrink-0 text-slate-400">({percent}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PieCharts;
