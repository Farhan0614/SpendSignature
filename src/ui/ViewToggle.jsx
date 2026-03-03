import { useSearchParams } from "react-router-dom";

function ViewToggle() {
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get("view") || "monthly";

  function setView(newView) {
    if (newView === "monthly") {
      // Clean URL for default view
      searchParams.delete("view");
      searchParams.delete("year");
    } else {
      // Set Year view
      searchParams.set("view", "yearly");
      searchParams.delete("month");
    }
    setSearchParams(searchParams);
  }

  // Common styling classes
  const baseClass =
    "cursor-pointer rounded-md px-3 py-1.5 text-sm font-semibold transition-all";
  const activeClass =
    "bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400 dark:shadow-slate-900/50";
  const inactiveClass =
    "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200";

  return (
    <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-900">
      <button
        onClick={() => setView("monthly")}
        className={`${baseClass} ${view === "monthly" ? activeClass : inactiveClass}`}
      >
        Monthly
      </button>
      <button
        onClick={() => setView("yearly")}
        className={`${baseClass} ${view === "yearly" ? activeClass : inactiveClass}`}
      >
        Yearly
      </button>
    </div>
  );
}

export default ViewToggle;
