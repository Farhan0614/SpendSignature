import { formatCurrency } from "../../utils/helpers";
import { useCurrency } from "../../context/CurrencyContext";
import { HiCheck, HiTrendingUp } from "react-icons/hi";

function SummaryCards({ totalBalance, monthlyBalance, monthlyExpense }) {
  const { currency } = useCurrency();

  return (
    <section className="flex flex-wrap justify-center gap-6">
      {/* === CARD 1 === */}
      <div className="max-w-sm min-w-[200px] flex-1 rounded-lg bg-white shadow-md">
        <div className="flex items-center justify-between rounded-t-lg bg-gradient-to-r from-teal-500 via-emerald-500 to-green-600 px-5 py-4 text-white">
          <div>
            <h3 className="text-sm font-semibold">Current Balance</h3>
            <p className="text-2xl font-semibold">
              {formatCurrency(monthlyBalance, currency)}
            </p>
          </div>
          <HiCheck className="h-7 w-7" />
        </div>
        <div className="flex items-center justify-between px-5 py-3">
          <p className="text-sm">
            <span className="font-bold text-emerald-500">Total Income</span>{" "}
            <span className="font-medium text-slate-400">(This Month)</span>
          </p>
          <HiTrendingUp className="h-7 w-7 text-emerald-600" />
        </div>
      </div>

      {/* === CARD 2 === */}
      <div className="max-w-sm min-w-[200px] flex-1 rounded-lg bg-white shadow-md">
        <div className="flex items-center justify-between rounded-t-lg bg-gradient-to-r from-orange-500 via-rose-500 to-red-600 px-5 py-4 text-white">
          <div>
            <h3 className="text-sm font-semibold">Total Expenses</h3>
            <p className="text-2xl font-semibold">
              {formatCurrency(monthlyExpense, currency)}
            </p>
          </div>
          <HiCheck className="h-7 w-7" />
        </div>
        <div className="flex items-center justify-between px-5 py-3">
          <p className="text-sm">
            <span className="font-bold text-rose-500">Total Income</span>{" "}
            <span className="font-medium text-slate-400">(This Month)</span>
          </p>
          <HiTrendingUp className="h-7 w-7 text-red-600" />
        </div>
      </div>
    </section>
  );
}

export default SummaryCards;
