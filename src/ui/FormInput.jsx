function FormInput({
  label,
  id,
  type = "text",
  register,
  error,
  disabled,
  className = "",
  ...rest // This captures extra props like placeholder, max, step, onWheel, etc.
}) {
  // Centralized Premium SaaS Styling
  const baseInputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700 transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400";
  const labelClass =
    "text-xs font-bold tracking-wider text-slate-500 uppercase";

  // Make number inputs slightly larger for better readability
  const typeSpecificClass =
    type === "number"
      ? "text-lg placeholder:font-medium placeholder:text-slate-400"
      : "";

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        disabled={disabled}
        className={`${baseInputClass} ${typeSpecificClass} ${className}`}
        {...register}
        {...rest}
      />
      {/* If there's an inline error passed down, show it here */}
      {error && (
        <span className="text-xs font-semibold text-red-500">{error}</span>
      )}
    </div>
  );
}

export default FormInput;
