import { useCurrency } from "../../context/CurrencyContext";
import {
  formatCurrency,
  formattedFullDate,
  formattedTitle,
} from "../../utils/helpers";
import { HiArrowDownCircle } from "react-icons/hi2";
import Modal from "../../ui/Modal"; // Ensure this import is correct
import ExpenseDetails from "./ExpenseDetails";
import { useIcon } from "../../hooks/useIcon";
import { useNavigate } from "react-router-dom";

function ExpenseRow({ expense }) {
  const navigate = useNavigate();
  const { currency } = useCurrency();
  const {
    amount,
    date,
    id,
    title,
    categories: { name: category_name, icon_name },
  } = expense;

  const Icon = useIcon(icon_name);

  function handleCategoryClick(e) {
    console.log(e);
    e.preventDefault();
    e.stopPropagation();
    navigate(`/category/${category_name}`);
  }

  return (
    <Modal>
      <Modal.Open opens={`expense-${id}`}>
        <div
          title="View Expense Details"
          className="mb-1 flex cursor-pointer items-center justify-between transition-all duration-200 hover:bg-slate-100"
        >
          <span className="flex items-center gap-1 font-sans font-semibold">
            <HiArrowDownCircle className="h-5 w-5" />
            <span>{formattedTitle(title)}</span>
          </span>
          <div className="flex items-center gap-5 text-sm font-semibold">
            <button
              onClick={handleCategoryClick}
              className="z-10 flex cursor-pointer items-center justify-center gap-1 rounded-md px-2 py-1 transition-colors hover:text-indigo-700"
              title="View Category Details"
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{category_name}</span>
            </button>
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
    </Modal>
  );
}

export default ExpenseRow;
