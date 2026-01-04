import { useNavigate } from "react-router-dom";
import { HiOutlineLogout } from "react-icons/hi";
import { useUser } from "../features/authentication/useUser";
import { useLogout } from "../features/authentication/useLogout";
import { useExpense } from "../features/expenses/useExpense"; // Fetch Expenses
import { useGetIncome } from "../features/wallet/useGetIncome"; // Fetch Income
import { formatCurrency } from "../utils/helpers";
import { useCurrency } from "../context/CurrencyContext";

function UserMenu() {
  const { user } = useUser();
  const { logout, isLoading } = useLogout();
  const navigate = useNavigate();
  const { currency } = useCurrency();

  // 1. Fetch Data (React Query will cache this, so it doesn't double-fetch if Dashboard is open)
  const { expenses } = useExpense();
  const { incomes } = useGetIncome();

  // 2. Calculate Global Balance (Net Worth)
  const totalIncome = incomes?.reduce((sum, item) => sum + item.income, 0) || 0;
  const totalExpense =
    expenses?.reduce((sum, item) => sum + item.amount, 0) || 0;
  const globalBalance = totalIncome - totalExpense;

  // Color logic: Red if 0 or negative
  const balanceColor = globalBalance <= 0 ? "text-red-500" : "text-emerald-600";

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="hidden items-center gap-4 md:flex">
      {user ? (
        <>
          <div className="hidden flex-col items-end lg:flex">
            {/* EMAIL */}
            <span className="text-sm font-semibold text-slate-700">
              {user.email?.split("@")[0]}
            </span>

            {/* REMAINING BALANCE (New Feature) */}
            <span className={`text-xs font-bold ${balanceColor}`}>
              {formatCurrency(globalBalance, currency)} available
            </span>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="group flex items-center justify-center rounded-full bg-slate-100 p-2 text-slate-600 transition-all hover:bg-indigo-50 hover:text-indigo-600"
            title="Logout"
          >
            <HiOutlineLogout className="h-5 w-5" />
          </button>
        </>
      ) : (
        // ... (Keep login buttons same as before)
        <div className="flex gap-2">{/* ... Login/Signup Buttons ... */}</div>
      )}
    </div>
  );
}

export default UserMenu;
