import { formatCurrency } from "../../utils/helpers";
import { useCurrency } from "../../context/CurrencyContext";
import { HiArrowTrendingUp, HiArrowTrendingDown } from "react-icons/hi2";
import { HiBanknotes } from "react-icons/hi2";

function SummaryCards({
  totalBalance, // Actual Net Worth (All Time)
  monthlyBalance, // Income this month
  monthlyExpense, // Expense this month
  displayMonth,
}) {
  const { currency } = useCurrency();

  return (
    <section className="flex flex-wrap justify-center gap-6">
      {/* === CARD 1: NET WORTH (Teal/Emerald - Wealth) === */}
      <div className="max-w-sm min-w-[300px] flex-1 rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition-transform">
        {/* HEADER: Gradient matching your old 'Income' style */}
        <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-5 text-white">
          <div>
            <h3 className="text-xs font-bold tracking-wider text-teal-50 uppercase">
              Total Balance
            </h3>
            <p className="mt-1 font-sans text-3xl font-black tracking-tight">
              {formatCurrency(totalBalance, currency)}
            </p>
          </div>
          <div className="rounded-lg bg-white/20 p-2 text-white">
            <HiBanknotes className="h-8 w-8" />
          </div>
        </div>

        {/* BODY: Context about this month's income */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <HiArrowTrendingUp className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400">
                Income ({displayMonth})
              </span>
              <span className="font-bold text-emerald-600">
                {formatCurrency(monthlyBalance, currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* === CARD 2: MONTHLY EXPENSE (Rose/Red - Spending) === */}
      <div className="max-w-sm min-w-[300px] flex-1 rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition-transform">
        {/* HEADER: Gradient matching your old 'Expense' style */}
        <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-rose-500 to-red-500 px-6 py-5 text-white">
          <div>
            <h3 className="text-xs font-bold tracking-wider text-rose-100 uppercase">
              Spent {displayMonth}
            </h3>
            <p className="mt-1 font-sans text-3xl font-black tracking-tight">
              {formatCurrency(monthlyExpense, currency)}
            </p>
          </div>
          <div className="rounded-lg bg-white/20 p-2 text-white">
            <HiArrowTrendingDown className="h-8 w-8" />
          </div>
        </div>

        {/* BODY: Footer Text */}
        <div className="px-6 py-4">
          <p className="text-sm text-slate-500">
            You have spent{" "}
            <span className="font-bold text-rose-600">
              {formatCurrency(monthlyExpense, currency)}
            </span>{" "}
            on expenses this month.
          </p>
        </div>
      </div>
    </section>
  );
}

export default SummaryCards;
