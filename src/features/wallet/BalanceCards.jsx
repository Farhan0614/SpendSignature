import { useCurrency } from "../../context/CurrencyContext";
import { formatCurrency } from "../../utils/helpers";
import Loader from "../../ui/Loader";

// 1. Accept data as props instead of fetching it internally
function BalanceCards({ totalBalance, monthlyBalance, isLoading }) {
  const { currency } = useCurrency();

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Total Balance Card */}
      <div className="flex flex-col rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-700">Total Balance</h2>

        {isLoading ? (
          <div className="flex h-28 items-center justify-center">
            <Loader />
          </div>
        ) : (
          <p className="mt-2 font-sans text-4xl font-bold text-indigo-600">
            {formatCurrency(totalBalance, currency)}
          </p>
        )}
      </div>

      {/* Monthly Balance Card */}
      <div className="flex flex-col rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-700">Monthly Income</h2>

        {isLoading ? (
          <div className="flex h-28 items-center justify-center">
            <Loader />
          </div>
        ) : (
          <>
            <p className="mt-2 font-sans text-4xl font-bold text-green-600">
              {formatCurrency(monthlyBalance, currency)}
            </p>
            <span className="mt-1 text-sm text-slate-500">
              Based on this month's income
            </span>
          </>
        )}
      </div>
    </section>
  );
}

export default BalanceCards;
