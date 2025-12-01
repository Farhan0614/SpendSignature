import { useCurrency } from "../../context/CurrencyContext";

import {
  formatCurrency,
  formattedFullDate,
  formattedTitle,
} from "../../utils/helpers";
import { HiArrowDownCircle } from "react-icons/hi2";
import Modal from "../../ui/Modal";
import ExpenseDetails from "./ExpenseDetails";
import { useIcon } from "../../hooks/useIcon";

function ExpenseRow({ expense }) {
  const { currency } = useCurrency();
  const {
    amount,
    date,
    id,
    title,
    categories: { name: category_name, icon_name },
  } = expense;

  const Icon = useIcon(icon_name);

  return (
    <>
      <Modal.Open opens={`expense-${id}`}>
        <div className="mb-1 flex cursor-default items-center justify-between transition-all duration-200 hover:bg-gray-100">
          <span className="flex items-center gap-1 font-sans font-semibold">
            <HiArrowDownCircle className="h-5 w-5" />
            <span>{formattedTitle(title)}</span>
          </span>
          <div className="flex items-center gap-5 text-sm font-semibold">
            <span className="flex items-center justify-center gap-1 font-sans">
              {<Icon className="h-4 w-4" />}
              <span>{category_name}</span>
            </span>
            <span className="font-sans">
              {formatCurrency(amount, currency)}
            </span>
            <span className="font-sans">{formattedFullDate(date)}</span>
          </div>
        </div>
      </Modal.Open>

      <Modal.Window name={`expense-${id}`}>
        <ExpenseDetails expense={expense} />
      </Modal.Window>
    </>
  );
}

export default ExpenseRow;
