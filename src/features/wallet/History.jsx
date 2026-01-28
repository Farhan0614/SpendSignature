import { useSearchParams } from "react-router-dom";
import { format, parseISO, isSameMonth } from "date-fns";
import Loader from "../../ui/Loader";
import IncHisItem from "./IncHisItem";
import { getMonthName, formatCurrency } from "../../utils/helpers";
import { useCurrency } from "../../context/CurrencyContext";

function History({ incomes, isLoading, view }) {
  const { currency } = useCurrency();
  const [searchParams] = useSearchParams();

  // --- 1. DYNAMIC TITLE LOGIC ---
  const today = new Date();
  let historyTitle = "";

  if (view === "monthly") {
    const currentMonthStr =
      searchParams.get("month") || format(today, "yyyy-MM");
    const selectedDate = new Date(`${currentMonthStr}-01`);

    if (isSameMonth(selectedDate, today)) {
      historyTitle = "History - This Month";
    } else {
      historyTitle = `History - ${format(selectedDate, "MMMM yyyy")}`;
    }
  } else {
    const currentYear =
      searchParams.get("year") || today.getFullYear().toString();
    historyTitle = `Yearly Breakdown - ${currentYear}`;
  }

  // --- 2. GROUPING & SORTING LOGIC ---
  let content;

  if (view === "monthly") {
    // Simple List (Already sorted by date from API)
    content = incomes?.map((income) => (
      <IncHisItem
        key={income.id}
        amount={income.income}
        month={income.month}
        year={income.year}
      />
    ));
  } else {
    // YEARLY: Group by Month
    const grouped = incomes?.reduce((acc, item) => {
      const key = `${item.month}-${item.year}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    // Render Groups (Sorted Descending by Month)
    content = grouped
      ? Object.entries(grouped)
          // Sort Logic: Compare the month of the first item in each group
          // b[1][0].month - a[1][0].month sorts Descending (Dec -> Jan)
          .sort((a, b) => b[1][0].month - a[1][0].month)
          .map(([key, items]) => {
            const monthNum = items[0].month;
            const groupTotal = items.reduce(
              (sum, item) => sum + item.income,
              0,
            );

            return (
              <div key={key} className="mb-4 last:mb-0">
                {/* Header with Total */}
                <div className="sticky top-0 mb-2 flex items-center justify-between bg-white/95 py-1 backdrop-blur-sm">
                  <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                    {getMonthName(monthNum)}
                  </h3>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                    {formatCurrency(groupTotal, currency)}
                  </span>
                </div>

                {/* Items in that month */}
                <div className="flex flex-col gap-2">
                  {items.map((income) => (
                    <IncHisItem
                      key={income.id}
                      amount={income.income}
                      month={income.month}
                      year={income.year}
                    />
                  ))}
                </div>
              </div>
            );
          })
      : null;
  }

  return (
    <div className="flex h-full w-full flex-col rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        {/* Uses the dynamic title now */}
        <h2 className="text-lg font-bold text-slate-700">{historyTitle}</h2>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader />
        </div>
      ) : !incomes || incomes.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-slate-100 py-10">
          <p className="font-medium text-slate-400">No records found</p>
        </div>
      ) : (
        <div className="custom-scrollbar flex-1 overflow-y-auto pr-2">
          <div className="flex flex-col gap-2">{content}</div>
        </div>
      )}
    </div>
  );
}

export default History;
