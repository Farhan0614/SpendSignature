import { useCurrency } from "../../context/CurrencyContext";
import { formatCurrency } from "../../utils/helpers";
import { useUser } from "../authentication/useUser";
import { useMonthlyBalance } from "./useMonthlyBalance";
import { useTotalBalance } from "./useTotalBalance";
import Loader from "../../ui/Loader";

function BalanceCards() {
  const { user } = useUser();
  const { currency } = useCurrency();

  const { monthlyBalance, isLoading } = useMonthlyBalance(user.id);
  const { totalBalance, isLoading: isLoading2 } = useTotalBalance(user.id);

  const loading = isLoading || isLoading2;

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Total Balance Card */}
      <div className="flex flex-col rounded-2xl bg-white p-6 shadow-md">
        <h2 className="text-lg font-semibold text-gray-700">Total Balance</h2>

        {loading ? (
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
      <div className="flex flex-col rounded-2xl bg-white p-6 shadow-md">
        <h2 className="text-lg font-semibold text-gray-700">Monthly Income</h2>

        {loading ? (
          <div className="flex h-28 items-center justify-center">
            <Loader />
          </div>
        ) : (
          <>
            <p className="mt-2 font-sans text-4xl font-bold text-green-600">
              {formatCurrency(monthlyBalance, currency)}
            </p>
            <span className="mt-1 text-sm text-gray-500">
              Based on this month's income
            </span>
          </>
        )}
      </div>
    </section>
  );
}

export default BalanceCards;
