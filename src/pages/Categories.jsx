import { FaTag } from "react-icons/fa";
import CategoriesList from "../features/categories/CategoriesList";
import Heading from "../ui/Heading";
import { useUser } from "../features/authentication/useUser";
import Redirect from "../ui/Redirect";
import DateNavigator from "../ui/DateNavigator";

function Categories() {
  const { user, isAuthenticated } = useUser();
  if (user === null || !isAuthenticated)
    return <Redirect pageName="categories" />;

  return (
    <div className="space-y-6">
      {/* FIX: Added 'items-start' to prevent stretching in column mode
       */}
      <header className="flex flex-col items-start gap-4 border-b border-slate-200 pb-4 xl:flex-row xl:items-center xl:justify-between dark:border-slate-800">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white">
          <FaTag className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <Heading>Category</Heading>
        </div>

        {/* FIX: Changed 'w-full' to 'w-fit' so it wraps the content tightly
         */}
        <div className="w-fit overflow-x-auto pb-1 md:w-auto md:pb-0">
          <DateNavigator />
        </div>
      </header>

      <CategoriesList />
    </div>
  );
}

export default Categories;
