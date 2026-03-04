import { useParams, useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi2";
import { useUser } from "../authentication/useUser";
import { useCategoryExpenses } from "./useCategoryExpenses";
import { useCategories } from "./useCategories";
import { useIcon } from "../../hooks/useIcon";
import Loader from "../../ui/Loader";
import CategoryTable from "./CategoryTable";
import CategorySpending from "./CategorySpending";
import Pagination from "../../ui/Pagination";
import ViewToggle from "../../ui/ViewToggle";
import DateNavigator from "../../ui/DateNavigator";
import YearNavigator from "../../ui/YearNavigator";
import SortBy from "../../ui/SortBy"; // <--- 1. IMPORT THIS

function CategoryDetails() {
  const { categoryName } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const { categories } = useCategories();

  // 1. Fetch Optimized Data
  const { expenses, count, stats, isLoadingList, isLoadingStats, view } =
    useCategoryExpenses(user?.id, categoryName);

  const categoryIcon = categories?.find(
    (category) => category.name === categoryName,
  )?.icon_name;

  const Icon = useIcon(categoryIcon);

  if (isLoadingStats) return <Loader />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      {/* HEADER NAV (Keep as is) */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <button
          onClick={() => navigate("/category")}
          className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200"
        >
          <HiArrowLeft /> Back
        </button>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <ViewToggle />
          {view === "monthly" ? <DateNavigator /> : <YearNavigator />}
        </div>
      </div>

      {/* TITLE Header (Keep as is) */}
      <div className="mb-8 flex items-center gap-4">
        <div className="rounded-2xl bg-indigo-50 p-4 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          {Icon ? <Icon className="h-8 w-8 md:h-12 md:w-12" /> : null}
        </div>
        <h1 className="font-sans text-3xl font-black text-slate-900 capitalize dark:text-white">
          {categoryName}
        </h1>
      </div>

      {/* STATS (Keep as is) */}
      <CategorySpending
        viewTotal={stats?.viewTotal || 0}
        globalTotal={stats?.globalTotal || 0}
        view={view}
      />

      {/* --- 2. ADD SORTING HERE --- */}
      {/* Placed between stats and table for clear "List Control" context */}
      <div className="mb-4 flex justify-end">
        <SortBy
          options={[
            { value: "date-desc", label: "Newest First" },
            { value: "date-asc", label: "Oldest First" },
            { value: "amount-desc", label: "Amount (High)" },
            { value: "amount-asc", label: "Amount (Low)" },
          ]}
        />
      </div>

      {/* TABLE + PAGINATION */}

      <div>
        <CategoryTable
          categoryExpenses={expenses}
          isLoadingList={isLoadingList}
          count={count}
        />
        <Pagination count={count} />
      </div>
    </div>
  );
}

export default CategoryDetails;
