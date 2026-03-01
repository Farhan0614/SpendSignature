import { useSearchParams } from "react-router-dom";
import { format, isSameMonth } from "date-fns";
import Loader from "../../ui/Loader";
import IncHisItem from "./IncHisItem";
import { formatCurrency } from "../../utils/helpers";
import { useCurrency } from "../../context/CurrencyContext";

function History({ incomes, isLoading, view }) {
  const { currency } = useCurrency();
  const [searchParams] = useSearchParams();

  // 1. GET SORT PARAM (Default to date-desc)
  const sortBy = searchParams.get("sortBy") || "date-desc";
  const [field, direction] = sortBy.split("-");

  // modifier: 1 for Ascending (Oldest First), -1 for Descending (Newest First)
  const modifier = direction === "asc" ? 1 : -1;

  // 2. SORT THE DATA (Client-Side)
  const sortedIncomes = incomes?.slice().sort((a, b) => {
    if (field === "date")
      return (new Date(a.date) - new Date(b.date)) * modifier; // Changed created_at -> date
    if (field === "amount") return (a.income - b.income) * modifier;
    return 0;
  });

  // --- DYNAMIC TITLE LOGIC ---
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

  // --- RENDER CONTENT LOGIC ---
  let content;

  // Show Flat List if Monthly OR if sorting by Amount
  const showFlatList = view === "monthly" || field === "amount";

  if (showFlatList) {
    // --- SCENARIO A: FLAT LIST ---
    content = (
      <>
        {field === "amount" && (
          <h3 className="mb-2 text-sm font-bold tracking-wider text-slate-500 uppercase">
            Ranked by Amount
          </h3>
        )}
        <div className="flex flex-col gap-2">
          {sortedIncomes?.map((income) => (
            <IncHisItem key={income.id} item={income} />
          ))}
        </div>
      </>
    );
  } else {
    // --- SCENARIO B: GROUPED BY MONTH (Yearly View + Date Sort) ---
    const grouped = sortedIncomes?.reduce((acc, item) => {
      const key = item.date.slice(0, 7);
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    content = grouped
      ? Object.entries(grouped)
          .sort((a, b) => a[0].localeCompare(b[0]) * modifier) // Sort alphabetically by "YYYY-MM"
          .map(([periodKey, items]) => {
            const groupTotal = items.reduce(
              (sum, item) => sum + item.income,
              0,
            );

            // Format "2026-02" to "February 2026"
            const prettyMonth = format(
              new Date(`${periodKey}-01`),
              "MMMM yyyy",
            );

            return (
              <div key={periodKey} className="mb-4 last:mb-0">
                <div className="sticky top-0 mb-2 flex items-center justify-between bg-white/95 py-1 backdrop-blur-sm">
                  <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                    {prettyMonth}
                  </h3>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                    {formatCurrency(groupTotal, currency)}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {items.map((income) => (
                    <IncHisItem key={income.id} item={income} />
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
        <h2 className="text-lg font-bold text-slate-700">{historyTitle}</h2>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader />
        </div>
      ) : !sortedIncomes || sortedIncomes.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-slate-100 py-10">
          <p className="font-medium text-slate-400">No records found</p>
        </div>
      ) : (
        <div className="custom-scrollbar flex-1 overflow-y-auto pr-2">
          {content}
        </div>
      )}
    </div>
  );
}

export default History;
