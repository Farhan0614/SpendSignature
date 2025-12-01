import { NavLink } from "react-router-dom";

function SideBarNavLink({ children, to }) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center gap-2 py-1 text-lg font-semibold transition-all duration-400 hover:text-indigo-600 hover:underline hover:decoration-indigo-600 hover:decoration-2 hover:underline-offset-4 active:text-indigo-600 ${
            isActive
              ? "text-indigo-600 underline decoration-indigo-600 decoration-2 underline-offset-4"
              : "text-gray-700"
          }`
        }
      >
        {children}
      </NavLink>
    </li>
  );
}

export default SideBarNavLink;
