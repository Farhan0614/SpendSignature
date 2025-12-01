import { FaTag } from "react-icons/fa";
import CategoriesList from "../features/categories/CategoriesList";
import Heading from "../ui/Heading";
import { useUser } from "../features/authentication/useUser";
import Redirect from "../ui/Redirect";

function Categories() {
  const { user, isAuthenticated } = useUser();
  if (user === null || !isAuthenticated)
    return <Redirect pageName="categories" />;

  return (
    <div className="space-y-6 px-15">
      <header>
        <div className="flex items-center gap-2 text-gray-900">
          <FaTag className="h-7 w-7" />
          <Heading>Category</Heading>
        </div>
      </header>

      <CategoriesList />
    </div>
  );
}

export default Categories;
