import { Link, useLocation } from "react-router-dom";
import { useIcon } from "../../hooks/useIcon";
import { formatCurrency } from "../../utils/helpers";
import { useCurrency } from "../../context/CurrencyContext";

function CategoryItem({ category }) {
  const { currency } = useCurrency();
  const { name, icon_name, total } = category;
  const location = useLocation();

  const Icon = useIcon(icon_name);

  return (
    <Link
      to={{
        pathname: `/category/${encodeURIComponent(name)}`,
        search: location.search,
      }}
      state={{ fromSearch: location.search }}
      className="group flex min-h-25 w-full cursor-pointer flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-900/50 dark:hover:border-indigo-500/50 dark:hover:shadow-indigo-500/10"
    >
      <div className="flex items-center gap-2 text-slate-700 group-hover:text-indigo-600 dark:text-slate-200">
        {Icon && <Icon size={24} />}
        <span className="text-sm font-bold tracking-tight md:text-base">
          {name}
        </span>
      </div>

      <span className="font-sans text-lg font-bold text-slate-900 dark:text-white">
        {formatCurrency(total, currency)}
      </span>
    </Link>
  );
}

export default CategoryItem;
