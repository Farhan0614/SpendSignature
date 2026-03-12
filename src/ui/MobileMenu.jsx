import { HiOutlineLogout } from "react-icons/hi";
import MobileNavItem from "./MobileNavItem";

function MobileMenu({ isOpen, setIsOpen, user, logout, isLoading }) {
  return (
    <div
      className={`overflow-hidden transition-all duration-300 md:hidden ${
        isOpen
          ? "max-h-96 border-b border-slate-200 dark:border-slate-800"
          : "max-h-0"
      }`}
    >
      <div className="space-y-1 bg-white px-4 pt-2 pb-4 shadow-inner dark:bg-slate-900">
        <MobileNavItem to="/dashboard" onClick={() => setIsOpen(false)}>
          Dashboard
        </MobileNavItem>
        <MobileNavItem to="/wallet" onClick={() => setIsOpen(false)}>
          Wallet
        </MobileNavItem>
        <MobileNavItem to="/category" onClick={() => setIsOpen(false)}>
          Categories
        </MobileNavItem>
        <MobileNavItem to="/expense" onClick={() => setIsOpen(false)}>
          Expenses
        </MobileNavItem>
        <MobileNavItem to="/forecast" onClick={() => setIsOpen(false)}>
          Insights
        </MobileNavItem>
        <MobileNavItem to="/settings" onClick={() => setIsOpen(false)}>
          Settings
        </MobileNavItem>

        {user && (
          <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              onClick={logout}
              disabled={isLoading}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <HiOutlineLogout /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MobileMenu;
