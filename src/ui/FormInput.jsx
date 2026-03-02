function FormInput({
  label,
  id,
  type = "text",
  register,
  error,
  disabled,
  className = "",
  children, // Used for <select> options
  ...rest // Captures value, onChange, placeholder, etc.
}) {
  // Centralized Premium SaaS Styling
  const baseInputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700 transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400";
  const labelClass =
    "mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase";

  // Make number inputs slightly larger
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

      {/* If type is select, render a dropdown. Otherwise, render an input. */}
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
