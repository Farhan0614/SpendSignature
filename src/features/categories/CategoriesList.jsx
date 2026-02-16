import { useSearchParams } from "react-router-dom"; // <--- 1. Import this
import CategoryItem from "./CategoryItem";
import { useCategories } from "./useCategories";
import Loader from "../../ui/Loader";
import { endOfMonth, formatISO, startOfMonth } from "date-fns";
import { useMonthAmount } from "./useMonthAmount";
import { useUser } from "../authentication/useUser";

function CategoriesList() {
  const { categories, isLoading } = useCategories();
  const { user } = useUser();
  const [searchParams] = useSearchParams(); // <--- 2. Get Params

  // --- 3. DYNAMIC DATE LOGIC ---
  // Check if user selected a specific month in URL (e.g. ?month=2023-12)
  const currentMonthParam = searchParams.get("month");

  // If param exists, use it. Otherwise, use Today.
  const referenceDate = currentMonthParam
    ? new Date(`${currentMonthParam}-01`)
    : new Date();

  // Calculate Start/End based on that Reference Date
  const startDate = formatISO(startOfMonth(referenceDate), {
    representation: "date",
  });
  const endDate = formatISO(endOfMonth(referenceDate), {
    representation: "date",
  });

  // --- 4. DATA FETCHING (Unchanged, but now receives dynamic dates) ---
  const { monthAmount, isLoading: isLoadingAmount } = useMonthAmount(
    startDate,
    endDate,
    user?.id,
  );

  const totalsMap =
    monthAmount?.reduce((acc, exp) => {
      acc[exp.category_id] = (acc[exp.category_id] || 0) + exp.amount;
      return acc;
    }, {}) || {};

  if (isLoading || isLoadingAmount) return <Loader />;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {categories.map((category) => {
        const total = totalsMap[category.id] || 0;
        return (
          <CategoryItem category={{ ...category, total }} key={category.id} />
        );
      })}
    </div>
  );
}

export default CategoriesList;
