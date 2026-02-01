import { format } from "date-fns";
import { useCurrency } from "../../context/CurrencyContext";
import { formatCurrency } from "../../utils/helpers";
import Modal from "../../ui/Modal"; // Ensure you have Modal imported
import IncomeDetails from "./IncomeDetails"; // The new component

function IncHisItem({ item }) {
  const { currency } = useCurrency();
  const { id, income, created_at } = item;

  return (
    <Modal>
      <Modal.Open opens={`income-${id}`}>
        <div className="group flex cursor-pointer items-center justify-between rounded-lg border border-transparent p-3 transition-all hover:border-slate-100 hover:bg-slate-50 hover:shadow-sm">
          <div className="flex flex-col">
            {/* Show Amount */}
            <span className="font-sans font-bold text-slate-700 transition-colors group-hover:text-indigo-600">
              {formatCurrency(income, currency)}
            </span>
          </div>

          {/* Show Full Date now */}
          <span className="text-sm font-medium text-slate-400">
            {format(new Date(created_at), "MMM dd, yyyy")}
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
