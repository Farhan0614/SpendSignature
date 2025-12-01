import CategoryItem from "./CategoryItem";
import { useCategories } from "./useCategories";
import Loader from "../../ui/Loader";
import { endOfMonth, formatISO, startOfMonth } from "date-fns";
import { useMonthAmount } from "./useMonthAmount";
import { useUser } from "../authentication/useUser";

function CategoriesList() {
  const { categories, isLoading } = useCategories();
  const { user } = useUser();
  const startDate = formatISO(startOfMonth(new Date()), {
    representation: "date",
  });
  const endDate = formatISO(endOfMonth(new Date()), { representation: "date" });

  const { monthAmount, isLoading: isLoadingAmount } = useMonthAmount(
    startDate,
    endDate,
    user?.id,
  );

  const totalsMap = monthAmount?.reduce((acc, exp) => {
    acc[exp.category_id] = (acc[exp.category_id] || 0) + exp.amount;
    return acc;
  }, {});

  if (isLoading || isLoadingAmount) return <Loader />;
  console.log(categories, monthAmount, totalsMap);

  return (
    <div className="flex flex-wrap gap-5">
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
