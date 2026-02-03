import { format } from "date-fns";
import { HiArrowDown, HiArrowUp } from "react-icons/hi";
import { formatCurrency } from "../../utils/helpers";
import { useCurrency } from "../../context/CurrencyContext";
import { useIcon } from "../../hooks/useIcon";

function RecentTransactionsItem({ trx, index }) {
  const { currency } = useCurrency();
  const isExpense = trx.type === "expense";

  const Icon = useIcon(trx.icon_name);

  return (
    <div className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-none last:pb-0">
      {/* LEFT: Icon & Text */}
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            isExpense
              ? "bg-red-50 text-red-600"
              : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {/* 3. Logic: Show Category Icon for Expense, Arrow for Income */}
          {isExpense ? (
            Icon ? (
              <Icon className="h-5 w-5" />
            ) : (
              <HiArrowDown className="h-5 w-5" />
            )
          ) : (
            <HiArrowUp className="h-5 w-5" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-700">{trx.title}</span>
          <span className="text-xs text-slate-400">
            {format(new Date(trx.date), "MMM dd, yyyy")}
          </span>
        </div>
      </div>

      {/* RIGHT: Amount */}
      <span
        className={`text-sm font-bold ${
          isExpense ? "text-red-500" : "text-emerald-500"
        }`}
      >
        {isExpense ? "-" : "+"}
        {formatCurrency(trx.amount, currency)}
      </span>
    </div>
  );
}

export default RecentTransactionsItem;
