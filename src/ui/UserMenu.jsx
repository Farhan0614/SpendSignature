import { useNavigate } from "react-router-dom";
import { HiOutlineLogout } from "react-icons/hi";
import { useUser } from "../features/authentication/useUser";
import { useLogout } from "../features/authentication/useLogout";
import { formatCurrency } from "../utils/helpers";
import { useCurrency } from "../context/CurrencyContext";
import { useBalanceData } from "../features/wallet/useBalanceData";
import { useProfile } from "../features/settings/useProfile";

function UserMenu() {
  const { user } = useUser();
  const { profile } = useProfile();
  const { logout, isLoading } = useLogout();

  // Renamed isLoading1 to isBalLoading for clarity
  const { currentBalance, isLoading: isBalLoading } = useBalanceData();

  const navigate = useNavigate();
  const { currency } = useCurrency();

  // Color logic: Red if 0 or negative
  const balanceColor =
    currentBalance <= 0 ? "text-red-500" : "text-emerald-600";

  // Logic: Use Profile Name -> Fallback to Email Prefix -> Fallback to "User"
  const displayName =
    profile?.full_name || user?.email?.split("@")[0] || "User";
  const avatarSrc = profile?.avatar_url || "/default-user.jpg";

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="hidden items-center gap-4 md:flex">
      {user ? (
        <>
          <div
            className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-all hover:bg-slate-100"
            onClick={() => navigate("/settings")}
          >
            {/* Avatar Image */}
            <img
              src={avatarSrc}
              alt="Avatar"
              className="h-10 w-10 rounded-full border border-slate-200 object-cover"
            />

            <div className="hidden flex-col items-start lg:flex">
              <span className="text-sm font-bold text-slate-700">
                {displayName}
              </span>

              {/* BALANCE LOGIC: Show Skeleton if loading, else show Value */}
              {isBalLoading ? (
                // The Skeleton Loader (Pulsing Gray Bar)
                <div className="mt-1 h-3 w-16 animate-pulse rounded bg-slate-200" />
              ) : (
                <span className={`text-xs font-bold ${balanceColor}`}>
                  {formatCurrency(currentBalance, currency)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="group flex cursor-pointer items-center justify-center rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
            title="Logout"
          >
            <HiOutlineLogout className="h-5 w-5" />
          </button>
        </>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/login")}
            className="cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
