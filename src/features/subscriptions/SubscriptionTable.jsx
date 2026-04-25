import Loader from "../../ui/Loader";
import { useCurrency } from "../../context/CurrencyContext";
import { formatCurrency, formattedFullDate } from "../../utils/helpers";
import { useSubscriptions } from "./useSubscriptions";
import SubscriptionRow from "./SubscriptionRow";

function SubscriptionTable() {
  const { subscriptions, isLoading } = useSubscriptions();
  const { currency } = useCurrency();

  if (isLoading) return <Loader />;

  if (!subscriptions.length) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">
          No subscriptions yet
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Add recurring expenses like rent, Netflix, internet, insurance, gym,
          or SaaS tools. Future charges will be created automatically.
        </p>
      </div>
    );
  }

  const activeSubscriptions = subscriptions.filter(
    (sub) => sub.status === "active",
  );
  const estimatedMonthlyCost = activeSubscriptions.reduce(
    (sum, sub) => sum + sub.amount / sub.interval_months,
    0,
  );
  const nextDue = activeSubscriptions[0]?.next_due_date || null;

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:border dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Active Plans
          </h3>
          <p className="mt-2 text-4xl font-black text-slate-900 dark:text-white">
            {activeSubscriptions.length}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:border dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Estimated Monthly Cost
          </h3>
          <p className="mt-2 font-sans text-4xl font-black text-indigo-600 dark:text-indigo-400">
            {formatCurrency(estimatedMonthlyCost, currency)}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:border dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Next Charge
          </h3>
          <p className="mt-2 text-xl font-black text-slate-900 dark:text-white">
            {nextDue ? formattedFullDate(nextDue) : "No active charges"}
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-900/50">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            All Subscriptions
          </h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {subscriptions.length} total
          </span>
        </div>

        <div className="flex flex-col gap-1">
          {subscriptions.map((subscription) => (
            <SubscriptionRow
              subscription={subscription}
              key={subscription.id}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default SubscriptionTable;
