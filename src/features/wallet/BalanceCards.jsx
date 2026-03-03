import { useSearchParams } from "react-router-dom";
import { format, isSameMonth } from "date-fns";
import { useCurrency } from "../../context/CurrencyContext";
import { formatCurrency } from "../../utils/helpers";
import Loader from "../../ui/Loader";

function BalanceCards({
  totalBalance,
  monthlyBalance,
  isLoading,
  label = "Monthly Income",
}) {
  const { currency } = useCurrency();
  const [searchParams] = useSearchParams();

  // 1. Get View State from URL
  const view = searchParams.get("view") || "monthly";
  const today = new Date();

  // 2. GENERATE DYNAMIC SUBTITLE
  let contextMessage = "";

  if (view === "monthly") {
    // Get selected month or default to today
    const currentMonthStr =
      searchParams.get("month") || format(today, "yyyy-MM");
    const selectedDate = new Date(`${currentMonthStr}-01`);

    // Check if it's the current real-world month
    if (isSameMonth(selectedDate, today)) {
      contextMessage = "Based on this month's income";
    } else {
      // e.g., "Total income for January 2026"
      contextMessage = `Total income for ${format(selectedDate, "MMMM yyyy")}`;
    }
  } else {
    // Yearly View
    const currentYear =
      searchParams.get("year") || today.getFullYear().toString();

    // e.g., "Total income for 2025"
    contextMessage = `Total income for ${currentYear}`;
  }

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Total Balance Card */}
      <div className="flex flex-col rounded-2xl bg-white p-6 shadow-sm dark:border dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
          Total Balance
        </h2>

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

      {/* Dynamic Context Card (Month/Year) */}
      <div className="flex flex-col rounded-2xl bg-white p-6 shadow-sm dark:border dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
          {label}
        </h2>

        {isLoading ? (
          <div className="flex h-28 items-center justify-center">
            <Loader />
          </div>
        ) : (
          <>
            <p className="mt-2 font-sans text-4xl font-bold text-green-600">
              {formatCurrency(monthlyBalance, currency)}
            </p>
            {/* The Dynamic Message */}
            <span className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
              {contextMessage}
            </span>
          </>
        )}
      </div>
    </section>
  );
}

export default BalanceCards;
