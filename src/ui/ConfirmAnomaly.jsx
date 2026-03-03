import { FaExclamationTriangle } from "react-icons/fa";
import { formatCurrency } from "../utils/helpers";
import { useCurrency } from "../context/CurrencyContext";
import Button from "./Button";

function ConfirmAnomaly({ message, amount, onConfirm, onCancel, isSaving }) {
  const { currency } = useCurrency();

  return (
    // MATCHING THE FORM CONTAINER STYLES
    // We use h-full and flex to center content nicely within the existing modal space
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-6 rounded-xl bg-slate-50 p-8 text-center sm:min-w-[500px] dark:bg-slate-900">
      {/* Icon with Animation */}
      <div className="animate-bounce rounded-full bg-yellow-100 p-4 text-yellow-600 shadow-sm dark:bg-yellow-500/10 dark:text-yellow-500">
        <FaExclamationTriangle size={40} />
      </div>

      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
          Unusual Spending Detected
        </h3>

        <p className="max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {message}
        </p>

        {/* Amount Highlight */}
        <div className="mx-auto mt-4 w-fit rounded-lg border border-slate-200 bg-white px-6 py-2 text-xl font-bold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
          {formatCurrency(amount, currency)}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex w-full max-w-xs gap-3">
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={isSaving}
          className="flex-1 py-3"
        >
          Let me fix it
        </Button>
        <Button
          variant="primary"
          onClick={onConfirm}
          disabled={isSaving}
          className="flex-1 py-3"
        >
          {isSaving ? "Saving..." : "I'm sure"}
        </Button>
      </div>
    </div>
  );
}

export default ConfirmAnomaly;
