import { Link } from "react-router-dom";
import { useIcon } from "../../hooks/useIcon";
import { formatCurrency } from "../../utils/helpers";
import { useCurrency } from "../../context/CurrencyContext";

function CategoryItem({ category }) {
  const { currency } = useCurrency();
  const { name, icon_name, total } = category;

  const Icon = useIcon(icon_name);

  return (
    <Link
      to={`/category/${name}`}
      className="flex h-20 w-55 cursor-pointer flex-col items-start justify-between rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm transition-all duration-300 hover:bg-slate-50"
    >
      <div className="flex items-center gap-1 text-slate-900">
        {Icon && <Icon size={20} />}
        <span className="font-bold tracking-tighter">{name}</span>
      </div>
      <span className="font-sans text-sm font-semibold text-slate-500">
        {formatCurrency(total, currency)}
      </span>
    </Link>
  );
}

export default CategoryItem;
