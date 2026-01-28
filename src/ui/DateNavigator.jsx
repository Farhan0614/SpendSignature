import { useSearchParams } from "react-router-dom";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { format, addMonths, subMonths, isSameMonth } from "date-fns";

function DateNavigator() {
  const [searchParams, setSearchParams] = useSearchParams();
  const today = new Date();

  const currentMonthStr = searchParams.get("month") || format(today, "yyyy-MM");
  const selectedDate = new Date(`${currentMonthStr}-01`);

  const isCurrentMonth = isSameMonth(selectedDate, today);

  function prevMonth() {
    const prev = subMonths(selectedDate, 1);
    // Always set param when going back
    searchParams.set("month", format(prev, "yyyy-MM"));
    setSearchParams(searchParams);
  }

  function nextMonth() {
    if (isCurrentMonth) return;

    const next = addMonths(selectedDate, 1);

    // ✅ LOGIC: If the NEXT month is the REAL current month, remove the param
    if (isSameMonth(next, today)) {
      searchParams.delete("month");
    } else {
      searchParams.set("month", format(next, "yyyy-MM"));
    }
    setSearchParams(searchParams);
  }

  return (
    <div className="flex items-center gap-4 rounded-lg border border-slate-100 bg-white p-2 shadow-sm">
      <button
        onClick={prevMonth}
        className="cursor-pointer rounded-full p-1 text-slate-600 hover:bg-slate-100"
      >
        <HiChevronLeft className="h-5 w-5" />
      </button>

      <span className="min-w-[120px] text-center text-sm font-bold text-slate-700">
        {format(selectedDate, "MMMM yyyy")}
      </span>

      <button
        onClick={nextMonth}
        disabled={isCurrentMonth}
        className={`rounded-full p-1 ${
          isCurrentMonth
            ? "cursor-not-allowed text-slate-300"
            : "cursor-pointer text-slate-600 hover:bg-slate-100"
        }`}
      >
        <HiChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

export default DateNavigator;
