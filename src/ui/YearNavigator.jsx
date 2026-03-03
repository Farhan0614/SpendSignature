import { useSearchParams } from "react-router-dom";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

function YearNavigator() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Default to current year
  const currentYear = parseInt(
    searchParams.get("year") || new Date().getFullYear(),
  );
  const realCurrentYear = new Date().getFullYear();

  function prevYear() {
    searchParams.set("year", currentYear - 1);
    setSearchParams(searchParams);
  }

  function nextYear() {
    if (currentYear >= realCurrentYear) return;
    searchParams.set("year", currentYear + 1);
    setSearchParams(searchParams);
  }

  return (
    <div className="flex items-center gap-4 rounded-lg border border-slate-100 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <button
        onClick={prevYear}
        className="cursor-pointer rounded-full p-1 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
      >
        <HiChevronLeft className="h-5 w-5" />
      </button>

      <span className="min-w-[80px] text-center text-sm font-bold text-slate-700 dark:text-slate-200">
        {currentYear}
      </span>

      <button
        onClick={nextYear}
        disabled={currentYear >= realCurrentYear}
        className={`rounded-full p-1 ${
          currentYear >= realCurrentYear
            ? "cursor-not-allowed text-slate-300 dark:text-slate-600"
            : "cursor-pointer text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
        }`}
      >
        <HiChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

export default YearNavigator;
