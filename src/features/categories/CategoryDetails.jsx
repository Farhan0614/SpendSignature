import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../authentication/useUser";
import { useCategoryExpenses } from "./useCategoryExpenses";
import Loader from "../../ui/Loader";
import { useCategories } from "./useCategories";
import { useIcon } from "../../hooks/useIcon";
import CategoryTable from "./CategoryTable";
import CategorySpending from "./CategorySpending";
import { HiArrowLeft } from "react-icons/hi2";

function CategoryDetails() {
  const { categories, isLoading: loadingCategories } = useCategories();
  const { categoryName } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

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
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-700"
      >
        <HiArrowLeft /> Back
      </button>

      <div className="mb-8 flex items-center gap-4">
        <div className="rounded-2xl bg-indigo-50 p-4 text-indigo-600">
          <Icon className="h-8 w-8 md:h-12 md:w-12" />
        </div>
        <h1 className="font-sans text-3xl font-black text-slate-900 capitalize md:text-5xl">
          {categoryName}
        </h1>
      </div>

      <CategorySpending categoryExpenses={categoryExpenses} />
      <CategoryTable categoryExpenses={categoryExpenses} />
    </div>
  );
}

export default CategoryDetails;
