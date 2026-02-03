import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CATEGORY_COLORS = {
  "Food & Groceries": "#10B981",
  Transport: "#F59E0B",
  Shopping: "#6366F1",
  Entertainment: "#EF4444",
  "Health & Fitness": "#06B6D4",
  "Bills & Utilities": "#3B82F6",
  Travel: "#8B5CF6",
  Education: "#84CC16",
  Housing: "#F97316",
  Financial: "#14B8A6",
  Others: "#A855F7",
};

function PieCharts({ monthlyExpense = [] }) {
  // Safely build data
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

  if (data.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">
        <p className="text-sm font-medium">No data yet</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60} // Makes it a "Doughnut"
          outerRadius={80} // Fits perfectly in 250px height
          paddingAngle={5} // Adds premium whitespace
          cornerRadius={5} // Rounded edges on slices
          dataKey="value"
          nameKey="name"
          stroke="none" // Removes default ugly border
        >
          {data.map((entry) => (
            <Cell
              key={entry.name}
              fill={CATEGORY_COLORS[entry.name] || "#CBD5E1"}
            />
          ))}
        </Pie>

        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            border: "none",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
          itemStyle={{ color: "#334155", fontSize: "12px", fontWeight: "600" }}
        />

        <Legend
          verticalAlign="bottom"
          align="center"
          iconSize={10}
          iconType="circle"
          wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default PieCharts;
