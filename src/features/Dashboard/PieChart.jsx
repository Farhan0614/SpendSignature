import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CATEGORY_COLORS = {
  "Food & Drinks": "#10B981",
  Transport: "#F59E0B",
  Shopping: "#6366F1",
  Entertainment: "#EF4444",
  "Health & Fitness": "#06B6D4",
  Utilities: "#3B82F6",
  Travel: "#8B5CF6",
  Education: "#84CC16",
  Home: "#F97316",
  Savings: "#14B8A6",
  Others: "#A855F7",
};

function PieCharts({ monthlyExpense = [] }) {
  // Safely build data
  const data =
    monthlyExpense.length > 0
      ? monthlyExpense.reduce((acc, exp) => {
          if (!exp?.categories?.name) return acc; // skip invalid items
          const existing = acc.find(
            (item) => item.name === exp.categories.name,
          );
          if (existing) existing.value += exp.amount;
          else acc.push({ name: exp.categories.name, value: exp.amount });
          return acc;
        }, [])
      : [];

  // ✅ If no valid data, show message
  if (data.length === 0) {
    return (
      <div className="flex h-[350px] w-full flex-col items-center justify-center rounded-lg bg-slate-50 text-slate-500">
        <p className="text-center text-sm font-medium">
          No expense data available for this month.
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={50}
          outerRadius={100}
          dataKey="value"
          nameKey="name"
          label
        >
          {data.map((entry) => (
            <Cell
              key={entry.name}
              fill={CATEGORY_COLORS[entry.name] || "#CBD5E1"}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          verticalAlign="bottom"
          align="center"
          layout="horizontal"
          iconSize={12}
          wrapperStyle={{ marginTop: "10px" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default PieCharts;
