import { HiArrowDownCircle } from "react-icons/hi2";
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
    <div className="flex items-center justify-between border-b border-gray-300 p-2 font-sans text-sm">
      <span className="font-semibold">{formattedFullDate(date)}</span>
      <span className="flex w-50 items-center gap-1 font-bold">
        <HiArrowDownCircle className="h-5 w-5" /> {formattedTitle(title)}
      </span>
      <span className="font-semibold">{formatCurrency(amount, currency)}</span>
    </div>
  );
}

export default ExpenseList;
