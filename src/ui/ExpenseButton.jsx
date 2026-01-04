function ExpenseButton({ children, onClick, isActive }) {
  return (
    <button
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium tracking-tight transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:outline-none ${
        isActive
          ? "bg-indigo-600 text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  );
}

export default ExpenseButton;
