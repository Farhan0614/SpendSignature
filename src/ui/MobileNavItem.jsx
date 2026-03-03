import { NavLink } from "react-router-dom";

function MobileNavItem({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `block rounded-lg px-3 py-2 text-base font-medium ${
          isActive
            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
            : "text-slate-600dark:text-slate-400 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default MobileNavItem;
