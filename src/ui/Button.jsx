function Button({
  children,
  variant = "primary",
  disabled,
  className = "",
  ...rest
}) {
  // Base classes applied to ALL buttons (animation, font, focus)
  const baseClass =
    "flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:translate-y-0";

  const variants = {
    primary:
      "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl focus-visible:ring-indigo-500 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none active:scale-95", // Added active:scale-95 here

    secondary:
      "border border-slate-200 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md focus-visible:ring-slate-400 disabled:bg-slate-50 disabled:text-slate-400 active:scale-95", // Added active:scale-95 here

    danger:
      "bg-red-600 text-white shadow-md shadow-red-200 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-lg focus-visible:ring-red-500 disabled:bg-red-300 active:scale-95", // Added active:scale-95 here

    "soft-primary":
      "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 focus-visible:ring-indigo-500 active:scale-95",

    "soft-danger":
      "bg-red-50 text-red-600 hover:bg-red-100 focus-visible:ring-red-500 active:scale-95",

    quiet:
      "bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-500", // Smooth, no jumping
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
