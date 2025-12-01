import { FaHashtag } from "react-icons/fa";
import { formatCurrency } from "../../utils/helpers";
import { useCurrency } from "../../context/CurrencyContext";

function CategorySpending({ categoryExpenses }) {
  const { currency } = useCurrency();

  const groupedByMonth = categoryExpenses.reduce((acc, exp) => {
    const monthKey = exp.date.slice(0, 7);
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(exp);
    return acc;
  }, {});

  const currentMonthKey = new Date().toISOString().slice(0, 7);
  const currentMonthExpenses = groupedByMonth[currentMonthKey] || [];

  const spentThisMonth = currentMonthExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0,
  );
  console.log(spentThisMonth);

  const totalSpent = categoryExpenses?.reduce(
    (sum, exp) => sum + exp.amount,
    0,
  );

  return (
    <>
      <div className="mb-10 flex items-center gap-6 border-b border-gray-50 pb-4">
        <div>
          <div className="flex items-center gap-1 font-sans text-sm font-semibold text-gray-500">
            <FaHashtag className="text-gray-400" />
            <span>Spent This Month</span>
          </div>
          <span className="font-sans text-sm font-bold text-gray-700">
            {formatCurrency(spentThisMonth, currency)}
          </span>
        </div>

        <div>
          <div className="flex items-center gap-1 font-sans text-sm font-semibold text-gray-500">
            <FaHashtag className="text-gray-400" />
            <span>Total Spent</span>
          </div>
          <span className="font-sans text-sm font-bold text-gray-700">
            {formatCurrency(totalSpent, currency)}
          </span>
        </div>
      </div>
    </>
  );
}

export default CategorySpending;
