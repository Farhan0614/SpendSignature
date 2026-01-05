import { useNavigate } from "react-router-dom";
import { HiOutlineLogout } from "react-icons/hi";
import { useUser } from "../features/authentication/useUser";
import { useLogout } from "../features/authentication/useLogout";
import { formatCurrency } from "../utils/helpers";
import { useCurrency } from "../context/CurrencyContext";
import { useBalanceData } from "../features/wallet/useBalanceData";

function UserMenu() {
  const { user } = useUser();
  const { logout, isLoading } = useLogout();
  const { currentBalance } = useBalanceData();

  const navigate = useNavigate();
  const { currency } = useCurrency();

  // Color logic: Red if 0 or negative
  const balanceColor =
    currentBalance <= 0 ? "text-red-500" : "text-emerald-600";

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
              {formatCurrency(currentBalance, currency)} available
            </span>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="group flex items-center justify-center rounded-full bg-slate-100 p-2 text-slate-600 transition-all hover:bg-indigo-50 hover:text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
            title="Logout"
          >
            <HiOutlineLogout className="h-5 w-5" />
          </button>
        </>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/login")}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
