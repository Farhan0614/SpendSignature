import { NavLink } from "react-router-dom";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 ${
          isActive
            ? // ACTIVE STATE:
              // Light: White bg + shadow + Indigo Text
              // Dark:  Slate-800 bg + Indigo-300 Text (No shadow to avoid glow)
              "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200 dark:bg-slate-700 dark:text-indigo-300 dark:ring-0"
            : // INACTIVE STATE:
              // Light: Gray text + Hover gray bg
              // Dark:  Gray text + Hover dark bg
              "text-slate-500 hover:bg-white/60 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default NavItem;
