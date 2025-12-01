import { useCurrency } from "../../context/CurrencyContext";
import {
  formatCurrency,
  formattedFullDate,
  formattedTitle,
} from "../../utils/helpers";
import { FaCalendar, FaHashtag, FaTag } from "react-icons/fa";
import { MdNotes } from "react-icons/md";

import { HiArrowDownCircle } from "react-icons/hi2";
import { useIcon } from "../../hooks/useIcon";

function ExpenseDetails({ expense }) {
  const { currency } = useCurrency();
  const {
    amount,
    date,
    notes,
    title,
    categories: { name: category_name, icon_name },
  } = expense;

  const Icon = useIcon(icon_name);

  return (
    <div className="h-[70vh] w-[70vw] max-w-[700px] overflow-y-auto px-9 py-16">
      <div className="font-sans text-gray-900">
        <HiArrowDownCircle className="mb-5 ml-3 h-20 w-20" />
        <h2 className="text-5xl font-black tracking-tight">
          {formattedTitle(title)}
        </h2>
      </div>

      <div className="mt-6 flex gap-5 border-b border-gray-200 pb-4">
        <div className="flex flex-col gap-2">
          <div className="flex gap-1 text-sm font-semibold text-gray-500">
            <FaHashtag className="text-gray-400" />
            <span>Amount</span>
          </div>
          <span className="text-sm font-bold text-gray-700">
            {formatCurrency(amount, currency)}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-1 text-sm font-semibold text-gray-500">
            <FaCalendar className="text-gray-400" />
            <span>Date</span>
          </div>
          <span className="text-sm font-bold text-gray-700">
            {formattedFullDate(date)}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-1 text-sm font-semibold text-gray-500">
            <FaTag className="text-gray-400" />
            <span>Category</span>
          </div>
          <span className="flex gap-1 text-sm font-bold text-gray-700">
            {<Icon className="h-4 w-4" />}
            <span>{category_name}</span>
          </span>
        </div>
      </div>

      <div className="mt-9 max-w-100 space-y-2 rounded-md bg-gray-50 p-4">
        <div className="flex items-center gap-2 text-gray-500">
          <MdNotes className="h-5 w-5" />
          <span className="text-sm font-semibold">Notes</span>
        </div>
        <span className="text-sm text-gray-700">
          {notes === "" ? "Empty" : notes}
        </span>
      </div>
    </div>
  );
}

export default ExpenseDetails;
