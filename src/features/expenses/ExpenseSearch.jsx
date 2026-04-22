import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";

function ExpenseSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("search") || "";
  const [value, setValue] = useState(urlQuery);
  const debounceRef = useRef(null);

  useEffect(() => {
    setValue(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  function updateSearch(nextValue) {
    const nextParams = new URLSearchParams(searchParams);
    const trimmed = nextValue.trim();

    if (trimmed) nextParams.set("search", trimmed);
    else nextParams.delete("search");

    nextParams.delete("page");
    setSearchParams(nextParams, { replace: true });
  }

  function handleChange(e) {
    const nextValue = e.target.value;
    setValue(nextValue);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateSearch(nextValue);
    }, 300);
  }

  function handleClear() {
    clearTimeout(debounceRef.current);
    setValue("");

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("search");
    nextParams.delete("page");
    setSearchParams(nextParams, { replace: true });
  }

  return (
    <div className="relative w-full sm:w-72">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <HiMagnifyingGlass className="h-4 w-4 text-slate-400" />
      </div>

      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search title or notes across all time..."
        aria-label="Search expenses"
        className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-8 pl-9 text-sm font-medium transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label="Clear search"
        >
          <HiXMark className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default ExpenseSearch;
