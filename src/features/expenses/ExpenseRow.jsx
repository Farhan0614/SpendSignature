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
import { useNavigate, useSearchParams } from "react-router-dom";
import Highlighter from "../../ui/HighLighter";

function ExpenseRow({ expense }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("search");
  const navigate = useNavigate();
  const { currency } = useCurrency();

  const amount = expense?.amount ?? 0;
  const date = expense?.date;
  const id = expense?.id;
  const title = expense?.title ?? "Untitled expense";
  const categoryName = expense?.categories?.name ?? "Uncategorized";
  const iconName = expense?.categories?.icon_name ?? null;

  const Icon = useIcon(iconName);

  function handleCategoryClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (categoryName !== "Uncategorized") {
      navigate(`/category/${categoryName}`);
    }
  }

  return (
    <Modal>
      <Modal.Open opens={`expense-${id}`}>
        <div
          title="View Expense Details"
          className="group mb-1 flex cursor-pointer items-center justify-between rounded-xl border border-transparent p-3 transition-all hover:border-slate-100 hover:bg-slate-50 hover:shadow-sm dark:hover:border-slate-700 dark:hover:bg-slate-800/50"
        >
          <div className="flex items-center gap-3">
            <HiArrowDownCircle className="h-6 w-6 text-slate-400 transition-colors group-hover:text-indigo-500 dark:text-slate-500" />
            <span className="font-sans font-bold text-slate-700 transition-colors group-hover:text-indigo-700 dark:text-slate-200">
              <Highlighter text={formattedTitle(title)} query={query} />
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm md:gap-6">
            <button
              onClick={handleCategoryClick}
              disabled={categoryName === "Uncategorized"}
              className="z-10 hidden items-center justify-center gap-1 rounded-md px-2 py-1 font-semibold text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex dark:text-slate-400 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-300"
              title="View Category Details"
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{categoryName}</span>
            </button>

            <div className="flex flex-col items-end sm:flex-row sm:items-center sm:gap-6">
              <span className="font-sans font-bold text-slate-900 dark:text-white">
                {formatCurrency(amount, currency)}
              </span>
              <span className="font-sans text-xs font-medium text-slate-400 sm:text-sm dark:text-slate-500">
                {formattedFullDate(date)}
              </span>
            </div>
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
