import { format } from "date-fns";
import { HiArrowDown, HiArrowUp } from "react-icons/hi";
import { formatCurrency } from "../../utils/helpers";
import { useCurrency } from "../../context/CurrencyContext";

// Added 'title' prop so we can reuse this for both lists
function RecentTransactions({ transactions, title = "Recent Activity" }) {
  const { currency } = useCurrency();

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-slate-700">{title}</h2>

      <div className="flex flex-col gap-4 overflow-y-auto">
        {transactions.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
            <p className="text-sm font-medium text-slate-400">
              No recent records
            </p>
          </div>
        ) : (
          transactions.map((trx, index) => {
            const isExpense = trx.type === "expense";

            return (
              <div
                key={`${trx.type}-${trx.id}-${index}`}
                className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-none last:pb-0"
              >
                {/* LEFT: Icon & Text */}
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      isExpense
                        ? "bg-red-50 text-red-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {isExpense ? (
                      <HiArrowDown className="h-5 w-5" />
                    ) : (
                      <HiArrowUp className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700">
                      {trx.title}
                    </span>
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
          })
        )}
      </div>
    </div>
  );
}

export default RecentTransactions;
