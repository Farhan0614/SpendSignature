import { useNavigate } from "react-router-dom";
import { useUser } from "../features/authentication/useUser";
import { formatCurrency } from "../utils/helpers";
import { useCurrency } from "../context/CurrencyContext";
import { useBalanceData } from "../features/wallet/useBalanceData";
import { useProfile } from "../features/settings/useProfile";
import Button from "./Button";

function UserMenu() {
  const { user } = useUser();
  const { profile } = useProfile();
  const { currentBalance, isLoading: isBalLoading } = useBalanceData();

  const navigate = useNavigate();
  const { currency } = useCurrency();

  const balanceColor =
    currentBalance <= 0
      ? "text-red-500 dark:text-red-400"
      : "dark:text-emerald-400 text-emerald-600";

  const displayName =
    profile?.full_name || user?.email?.split("@")[0] || "User";
  const avatarSrc = profile?.avatar_url || "/default-user.jpg";

  return (
    <div className="hidden items-center md:flex">
      {user ? (
        // Added 'group' to handle hover effects smoothly
        <div
          className="group flex cursor-pointer items-center gap-3 rounded-full border border-transparent p-1.5 pr-4 transition-all hover:border-slate-200 hover:bg-slate-100 dark:hover:border-slate-700 dark:hover:bg-slate-800"
          onClick={() => navigate("/settings")}
          title="Profile & Settings"
        >
          <img
            src={avatarSrc}
            alt="Avatar"
            className="h-9 w-9 rounded-full border border-slate-200 object-cover shadow-sm transition-transform group-hover:scale-105 dark:border-slate-700"
          />

          {/* Hide text on small laptops, show on large screens */}
          <div className="hidden flex-col items-start lg:flex">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {displayName}
            </span>

            {isBalLoading ? (
              <div className="mt-0.5 h-3 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            ) : (
              <span
                className={`text-xs font-bold tracking-tight ${balanceColor}`}
              >
                {formatCurrency(currentBalance, currency)}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 pl-4">
          <Button
            variant="quiet"
            onClick={() => navigate("/login")}
            className="px-4 py-2"
          >
            Login
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate("/signup")}
            className="px-4 py-2"
          >
            Sign Up
          </Button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
