import { format } from "date-fns";
import { useCurrency } from "../../context/CurrencyContext";
import { formatCurrency } from "../../utils/helpers";
import Modal from "../../ui/Modal"; // Ensure you have Modal imported
import IncomeDetails from "./IncomeDetails"; // The new component

function IncHisItem({ item }) {
  const { currency } = useCurrency();
  const { id, income, date, source } = item;

  return (
    <Modal>
      <Modal.Open opens={`income-${id}`}>
        <div className="group flex cursor-pointer items-center justify-between rounded-lg border border-transparent p-3 transition-all hover:border-slate-100 hover:bg-slate-50 hover:shadow-sm dark:hover:border-slate-800 dark:hover:bg-slate-800/50">
          <div className="flex flex-col">
            <span className="font-sans font-bold text-slate-700 transition-colors group-hover:text-indigo-600 dark:text-slate-200 dark:group-hover:text-indigo-400">
              {formatCurrency(income, currency)}
            </span>
            {/* Display the new Source field! */}
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              {source}
            </span>
          </div>

          <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
            {format(new Date(date), "MMM dd, yyyy")} {/* Changed to date */}
          </span>
        </div>
      </Modal.Open>

      {/* The Modal Window */}
      <Modal.Window name={`income-${id}`}>
        <IncomeDetails incomeItem={item} />
      </Modal.Window>
    </Modal>
  );
}

export default IncHisItem;
