import { useState } from "react";
import { format } from "date-fns";
import { FaCalendar, FaPencilAlt, FaTag, FaTrash } from "react-icons/fa";
import { MdNotes } from "react-icons/md";
import Button from "../../ui/Button";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { useCurrency } from "../../context/CurrencyContext";
import { useIcon } from "../../hooks/useIcon";
import {
  formatCurrency,
  formattedFullDate,
  formattedTitle,
} from "../../utils/helpers";
import { useDeleteSubscription } from "./useDeleteSubscription";
import { useUpdateSubscription } from "./useUpdateSubscription";
import SubscriptionForm from "./SubscriptionForm";

function intervalLabel(months) {
  if (months === 1) return "Monthly";
  if (months === 3) return "Quarterly";
  if (months === 6) return "Every 6 Months";
  if (months === 12) return "Yearly";
  return `Every ${months} Months`;
}

function SubscriptionDetails({ subscription, onCloseModal }) {
  const { currency } = useCurrency();
  const { deleteSubscription, isDeleting } = useDeleteSubscription();
  const { updateSubscription, isUpdating } = useUpdateSubscription();
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const {
    id,
    title,
    amount,
    notes,
    next_due_date,
    interval_months,
    status,
    created_at,
    categories,
  } = subscription;

  const Icon = useIcon(categories?.icon_name);

  if (isEditing) {
    return (
      <div className="w-[90vw] max-w-4xl">
        <SubscriptionForm
          subscriptionToEdit={subscription}
          onCloseForm={onCloseModal}
        />
      </div>
    );
  }

  if (isConfirmingDelete) {
    return (
      <ConfirmDelete
        resourceName="Subscription"
        message={`Delete "${title}"? Existing generated expense history will remain, but this recurring plan will be removed.`}
        onConfirm={() => deleteSubscription(id, { onSuccess: onCloseModal })}
        onCancel={() => setIsConfirmingDelete(false)}
        disabled={isDeleting}
      />
    );
  }

  return (
    <div className="flex w-[85vw] max-w-md flex-col gap-6 pt-2">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 shadow-inner dark:from-indigo-900 dark:to-indigo-800 dark:text-indigo-200">
          {Icon && <Icon size={36} />}
        </div>

        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          {formattedTitle(title)}
        </h2>

        <span
          className={`mt-3 rounded-full px-3 py-1 text-xs font-bold tracking-widest uppercase ${
            status === "active"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
        <div className="flex flex-col items-center justify-center gap-1 text-center">
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            Amount
          </span>
          <span className="font-sans font-black text-indigo-600 dark:text-indigo-400">
            {formatCurrency(amount, currency)}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center gap-1 border-x border-slate-200/60 px-2 text-center dark:border-slate-700">
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            <FaCalendar className="mr-1 inline" />
            Next Due
          </span>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
            {formattedFullDate(next_due_date)}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center gap-1 text-center">
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            <FaTag className="mr-1 inline" />
            Cycle
          </span>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
            {intervalLabel(interval_months)}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-2 flex items-center gap-2 text-slate-400">
          <MdNotes className="h-5 w-5" />
          <span className="text-xs font-bold tracking-wider uppercase">
            Notes
          </span>
        </div>

        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {notes || (
            <span className="text-slate-400 italic">No notes provided.</span>
          )}
        </p>
      </div>

      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 text-sm text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
        Cancelling stops future auto-generated charges. Existing generated
        expenses remain in your history.
      </div>

      <div className="mt-2 flex flex-wrap gap-3">
        <Button
          variant="soft-primary"
          onClick={() => setIsEditing(true)}
          className="flex-1 py-3"
        >
          <FaPencilAlt size={14} /> Edit
        </Button>

        {status === "active" && (
          <Button
            variant="secondary"
            disabled={isUpdating}
            onClick={() =>
              updateSubscription(
                { id, status: "cancelled" },
                { onSuccess: onCloseModal },
              )
            }
            className="flex-1 py-3"
          >
            Cancel Subscription
          </Button>
        )}

        <Button
          variant="soft-danger"
          onClick={() => setIsConfirmingDelete(true)}
          className="flex-1 py-3"
        >
          <FaTrash size={14} /> Delete
        </Button>
      </div>

      <div className="mt-1 text-center">
        <p className="text-[12px] font-medium text-slate-400">
          Created on {format(new Date(created_at), "MMM dd, yyyy 'at' hh:mm a")}
        </p>
      </div>
    </div>
  );
}

export default SubscriptionDetails;
