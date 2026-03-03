import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../utils/constants";

function Pagination({ count }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));
  const pageCount = Math.ceil(count / PAGE_SIZE);

  function nextPage() {
    const next = currentPage === pageCount ? currentPage : currentPage + 1;
    searchParams.set("page", next);
    setSearchParams(searchParams);
  }

  function prevPage() {
    const prev = currentPage === 1 ? currentPage : currentPage - 1;
    searchParams.set("page", prev);
    setSearchParams(searchParams);
  }

  if (pageCount <= 1) return null;

  return (
    <div className="flex w-full items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3 dark:border-slate-800 dark:bg-slate-900/50">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
        Showing{" "}
        <span className="font-bold">{(currentPage - 1) * PAGE_SIZE + 1}</span>{" "}
        to{" "}
        <span className="font-bold">
          {currentPage === pageCount ? count : currentPage * PAGE_SIZE}
        </span>{" "}
        of <span className="font-bold">{count}</span> results
      </p>

      <div className="flex gap-2">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="flex cursor-pointer items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold text-slate-600 transition-all hover:bg-indigo-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-600 dark:text-slate-400 dark:hover:bg-indigo-500 dark:disabled:hover:text-slate-400"
        >
          <HiChevronLeft /> Previous
        </button>

        <button
          onClick={nextPage}
          disabled={currentPage === pageCount}
          className="flex cursor-pointer items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold text-slate-600 transition-all hover:bg-indigo-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-600 dark:text-slate-400 dark:hover:bg-indigo-500 dark:disabled:hover:text-slate-400"
        >
          Next <HiChevronRight />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
