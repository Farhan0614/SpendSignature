import { NavLink } from "react-router-dom";

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

export default NavItem;
