import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { HiOutlineLogout } from "react-icons/hi";
import Logo from "./Logo"; // Ensure your Logo text is visible on white
import { useLogout } from "../features/authentication/useLogout";

function Header({ user }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, isLoading } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    // Sticky header with glassmorphism effect
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* --- LEFT: LOGO --- */}
        <div
          className="flex cursor-pointer items-center gap-2"
          onClick={() => navigate("/dashboard")}
        >
          <Logo />
        </div>

        {/* --- MIDDLE: DESKTOP NAVIGATION --- */}
        <nav className="hidden items-center gap-1 md:flex">
          <NavItem to="/dashboard">Dashboard</NavItem>
          <NavItem to="/wallet">Wallet</NavItem>
          <NavItem to="/category">Categories</NavItem>
          <NavItem to="/expense">Expenses</NavItem>
          <NavItem to="/settings">Settings</NavItem>
        </nav>

        {/* --- RIGHT: USER & LOGOUT --- */}
        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <>
              <div className="hidden flex-col items-end lg:flex">
                <span className="text-sm font-semibold text-slate-700">
                  {user.email?.split("@")[0]}
                </span>
                <span className="text-xs text-slate-400">Pro Plan</span>
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
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/login")}
                className="text-sm font-semibold text-slate-600 hover:text-indigo-600"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* --- MOBILE MENU BUTTON --- */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-600 hover:text-indigo-600 focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <HiXMark className="h-7 w-7" />
            ) : (
              <HiBars3 className="h-7 w-7" />
            )}
          </button>
        </div>
      </div>

      {/* --- MOBILE NAVIGATION DROPDOWN --- */}
      {/* Smooth height transition */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          isMobileMenuOpen ? "max-h-96 border-b border-slate-200" : "max-h-0"
        }`}
      >
        <div className="space-y-1 bg-white px-4 pt-2 pb-4 shadow-inner">
          <MobileNavItem to="/home" onClick={() => setIsMobileMenuOpen(false)}>
            Dashboard
          </MobileNavItem>
          <MobileNavItem
            to="/wallet"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Wallet
          </MobileNavItem>
          <MobileNavItem
            to="/category"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Categories
          </MobileNavItem>
          <MobileNavItem
            to="/expense"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Expenses
          </MobileNavItem>
          <MobileNavItem
            to="/settings"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Settings
          </MobileNavItem>

          <div className="mt-4 border-t border-slate-100 pt-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50"
            >
              <HiOutlineLogout /> Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// --- HELPER COMPONENTS FOR LINKS ---

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200"
            : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

function MobileNavItem({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `block rounded-lg px-3 py-2 text-base font-medium ${
          isActive
            ? "bg-indigo-50 text-indigo-700"
            : "text-slate-600 hover:bg-slate-50 hover:text-gray-900"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default Header;
