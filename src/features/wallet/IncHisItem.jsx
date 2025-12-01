import { useCurrency } from "../../context/CurrencyContext";
import { formatCurrency, getMonthName } from "../../utils/helpers";

function IncHisItem({ amount, month, year }) {
  const { currency } = useCurrency();

  return (
    <div className="flex justify-between py-2">
      <span className="font-sans font-medium">
        {formatCurrency(amount, currency)}
      </span>
      <span className="text-gray-500">
        {getMonthName(month)} {year}
      </span>
    </div>
  );
}

export default IncHisItem;
