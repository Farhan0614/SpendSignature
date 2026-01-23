import { useCurrency } from "../../context/CurrencyContext";
import {
  formatCurrency,
  formattedFullDate,
  formattedTitle,
} from "../../utils/helpers";

function ExpenseList({ expense }) {
  const { currency } = useCurrency();
  const { date, title, amount } = expense;

  return (
    <div className="grid grid-cols-3 items-center px-6 py-4 transition-colors hover:bg-slate-50">
      {/* Col 1: Date */}
      <span className="text-sm font-medium text-slate-500">
        {formattedFullDate(date)}
      </span>

      {/* Col 2: Title */}
      <span className="truncate pr-4 text-sm font-bold text-slate-700">
        {formattedTitle(title)}
      </span>

      <span className="text-right text-sm font-bold text-slate-900">
        {formatCurrency(amount, currency)}
      </span>
    </div>
  );
}

export default ExpenseList;
