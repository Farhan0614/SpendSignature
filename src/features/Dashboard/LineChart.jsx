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

const data = [
  { name: "Jan", income: 3200, expense: 2100 },
  { name: "Feb", income: 2800, expense: 1900 },
  { name: "Mar", income: 3500, expense: 2500 },
  { name: "Apr", income: 4000, expense: 2700 },
  { name: "May", income: 3800, expense: 2900 },
  { name: "Jun", income: 4200, expense: 3100 },
  { name: "Jul", income: 4500, expense: 3300 },
  { name: "Aug", income: 4700, expense: 3600 },
  { name: "Sep", income: 4400, expense: 3100 },
  { name: "Oct", income: 4600, expense: 3500 },
  { name: "Nov", income: 4900, expense: 3700 },
  { name: "Dec", income: 5200, expense: 3900 },
];

function IncomeVsExpenseChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 30, right: 30, left: 0, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="income"
          stroke="#22c55e"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="expense"
          stroke="#ef4444"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default IncomeVsExpenseChart;
