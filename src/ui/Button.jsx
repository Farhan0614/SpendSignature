function Button({
  children,
  variant = "primary",
  disabled,
  className = "",
  ...rest
}) {
  const baseClass =
    "flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:translate-y-0";

  const variants = {
    primary:
      // Light: Indigo-200 shadow (Soft purple)
      // Dark:  Indigo-900 shadow (Deep dark purple, barely visible) or shadow-none
      "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl focus-visible:ring-indigo-500 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none active:scale-95 " +
      "dark:bg-indigo-500 dark:shadow-indigo-900/20 dark:hover:bg-indigo-400 dark:hover:shadow-indigo-900/40",

    secondary:
      "border border-slate-200 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md focus-visible:ring-slate-400 disabled:bg-slate-50 disabled:text-slate-400 active:scale-95 " +
      "dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:shadow-none dark:hover:bg-slate-700",

    danger:
      // Light: Red-200 shadow
      // Dark:  Red-900 shadow or none
      "bg-red-600 text-white shadow-md shadow-red-200 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-lg focus-visible:ring-red-500 disabled:bg-red-300 active:scale-95 " +
      "dark:bg-red-500 dark:shadow-red-900/20 dark:hover:bg-red-400 dark:hover:shadow-red-900/40",

    "soft-primary":
      "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 focus-visible:ring-indigo-500 active:scale-95 " +
      "dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20",

    "soft-danger":
      "bg-red-50 text-red-600 hover:bg-red-100 focus-visible:ring-red-500 active:scale-95 " +
      "dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20",

    quiet:
      "bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-500 " +
      "dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
  };

  return (
    <button
      disabled={disabled}
      className={`${baseClass} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
