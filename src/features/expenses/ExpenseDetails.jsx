import { useCurrency } from "../../context/CurrencyContext";
import {
  formatCurrency,
  formattedFullDate,
  formattedTitle,
} from "../../utils/helpers";
import { FaCalendar, FaHashtag, FaTag } from "react-icons/fa";
import { MdNotes } from "react-icons/md";
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
    // CHANGED: Flexible width, sensible max-width, removed fixed height
    <div className="w-full max-w-lg space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          {Icon && <Icon size={40} />}
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
          {formattedTitle(title)}
        </h2>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-3 divide-x divide-slate-100 border-y border-slate-100 py-6">
        <div className="flex flex-col items-center gap-1 px-2 text-center">
          <span className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase">
            <FaHashtag /> Amount
          </span>
          <span className="font-bold text-slate-700">
            {formatCurrency(amount, currency)}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 px-2 text-center">
          <span className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase">
            <FaCalendar /> Date
          </span>
          <span className="font-bold text-slate-700">
            {formattedFullDate(date)}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 px-2 text-center">
          <span className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase">
            <FaTag /> Category
          </span>
          <span className="font-bold text-slate-700">{category_name}</span>
        </div>
      </div>

      {/* Notes Section */}
      <div className="rounded-xl bg-slate-50 p-4">
        <div className="mb-2 flex items-center gap-2 text-slate-500">
          <MdNotes className="h-5 w-5" />
          <span className="text-sm font-bold tracking-wide uppercase">
            Notes
          </span>
        </div>
        <p className="text-sm text-slate-600 italic">
          {notes || "No notes provided."}
        </p>
      </div>
    </div>
  );
}

export default ExpenseDetails;
