function FormInput({
  label,
  id,
  type = "text",
  register,
  error,
  disabled,
  className = "",
  children,
  ...rest
}) {
  const baseInputClass =
    // 1. Layout & Animation
    "w-full rounded-xl border p-3 text-sm font-bold transition-all outline-none " +
    // 2. Light Mode (Normal & Focus)
    "border-slate-200 bg-slate-50 text-slate-700 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 " +
    // 3. Light Mode (Disabled) -> This was overriding Dark Mode!
    "disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed " +
    // 4. Dark Mode (Normal & Focus)
    "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:bg-slate-800 " +
    // 5. Dark Mode (Disabled) -> THIS IS THE FIX ✅
    "dark:disabled:bg-slate-800 dark:disabled:text-slate-500 dark:disabled:border-slate-800";

  const labelClass =
    "mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400";

  const typeSpecificClass =
    type === "number"
      ? "text-lg placeholder:font-medium placeholder:text-slate-400"
      : "";

  return (
    <div className={`relative w-full pb-5 ${className}`}>
      {label && (
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
      )}

      {type === "select" ? (
        <select
          id={id}
          disabled={disabled}
          className={`${baseInputClass} ${className}`}
          {...(register || {})}
          {...rest}
        >
          {children}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          disabled={disabled}
          className={`${baseInputClass} ${typeSpecificClass} ${className}`}
          {...(register || {})}
          {...rest}
        />
      )}

      {error && (
        <span className="absolute bottom-0 left-0 text-[11px] font-semibold text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}

export default FormInput;
