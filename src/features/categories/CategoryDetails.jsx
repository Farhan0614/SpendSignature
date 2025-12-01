import { useParams } from "react-router-dom";
import { useUser } from "../authentication/useUser";
import { useCategoryExpenses } from "./useCategoryExpenses";
import Loader from "../../ui/Loader";
import { useCategories } from "./useCategories";
import { useIcon } from "../../hooks/useIcon";
import CategoryTable from "./CategoryTable";
import CategorySpending from "./CategorySpending";

function CategoryDetails() {
  const { categories, isLoading: loadingCategories } = useCategories();
  const { categoryName } = useParams();
  const { user } = useUser();

  const { categoryExpenses, isLoading } = useCategoryExpenses(
    user?.id,
    categoryName,
  );

  const categoryIcon = categories?.find(
    (category) => category.name === categoryName,
  )?.icon_name;

  const Icon = useIcon(categoryIcon);

  if (isLoading || loadingCategories) return <Loader />;

  return (
    <div className="flex flex-col gap-3 px-20 pt-30">
      <span className="p-3">
        <Icon className="h-15 w-15" />
      </span>

      <h1 className="font-sans text-5xl font-black text-gray-900">
        {categoryName}
      </h1>

      <CategorySpending categoryExpenses={categoryExpenses} />

      <CategoryTable categoryExpenses={categoryExpenses} />
    </div>
  );
}

export default CategoryDetails;
