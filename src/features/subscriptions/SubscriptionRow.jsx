import Modal from "../../ui/Modal";
import { useCurrency } from "../../context/CurrencyContext";
import { useIcon } from "../../hooks/useIcon";
import {
  formatCurrency,
  formattedFullDate,
  formattedTitle,
} from "../../utils/helpers";
import SubscriptionDetails from "./SubscriptionDetails";

function intervalLabel(months) {
  if (months === 1) return "Monthly";
  if (months === 3) return "Quarterly";
  if (months === 6) return "Every 6 Months";
  if (months === 12) return "Yearly";
  return `Every ${months} Months`;
}

function SubscriptionRow({ subscription }) {
  const { currency } = useCurrency();
  const Icon = useIcon(subscription.categories?.icon_name);

  return (
    <Modal>
      <Modal.Open opens={`subscription-${subscription.id}`}>
        <div className="group mb-1 flex cursor-pointer items-center justify-between rounded-xl border border-transparent p-4 transition-all hover:border-slate-100 hover:bg-slate-50 hover:shadow-sm dark:hover:border-slate-700 dark:hover:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              {Icon ? (
                <Icon className="h-5 w-5" />
              ) : (
                <span className="font-bold">S</span>
              )}
            </div>

            <div>
              <p className="font-bold text-slate-800 dark:text-slate-100">
                {formattedTitle(subscription.title)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {subscription.categories?.name || "Uncategorized"} •{" "}
                {intervalLabel(subscription.interval_months)}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 text-right">
            <span className="font-sans text-lg font-bold text-slate-900 dark:text-white">
              {formatCurrency(subscription.amount, currency)}
            </span>

            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Next due: {formattedFullDate(subscription.next_due_date)}
            </span>

            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase ${
                subscription.status === "active"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
              }`}
            >
              {subscription.status}
            </span>
          </div>
        </div>
      </Modal.Open>

      <Modal.Window name={`subscription-${subscription.id}`}>
        <SubscriptionDetails subscription={subscription} />
      </Modal.Window>
    </Modal>
  );
}

export default SubscriptionRow;
