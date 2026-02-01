import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAddIncome } from "./useAddIncome";
import { useUser } from "../authentication/useUser";
import LoaderMini from "../../ui/LoaderMini";

function IncomeForm() {
  const { addIncome, isAddingIncome } = useAddIncome();
  const { user } = useUser();

  // 1. Setup React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: "",
      created_at: new Date().toISOString().split("T")[0], // Default to Today
    },
  });

  const today = new Date().toISOString().split("T")[0];

  // 2. Submit Handler
  function onSubmit(data) {
    const value = parseFloat(data.amount);

    // --- FIX START ---
    // 1. Parse the user's selected date (YYYY-MM-DD)
    const [year, month, day] = data.created_at.split("-").map(Number);

    // 2. Create a Date object representing "Right Now"
    // This gives us the current Hours, Minutes, Seconds, and Milliseconds
    const dateWithTime = new Date();

    // 3. Overwrite the Year/Month/Day with the user's selection
    // We subtract 1 from month because JavaScript months are 0-indexed (0=Jan, 1=Feb)
    dateWithTime.setFullYear(year);
    dateWithTime.setMonth(month - 1);
    dateWithTime.setDate(day);

    // 4. Generate the final ISO string
    // This will look like: "2026-02-01T21:45:12.714Z" instead of "2026-02-01T00:00:00.000Z"
    const timestamp = dateWithTime.toISOString();
    // --- FIX END ---

    // Calculate month/year for the separate columns (Using the same logic)
    const dbMonth = month; // We already have the 1-indexed month from the split
    const dbYear = year;

    addIncome(
      {
        month: dbMonth,
        year: dbYear,
        user_id: user.id,
        income: value,
        created_at: timestamp,
      },
      {
        onSuccess: () => {
          reset();
        },
      },
    );
  }

  // 3. Error Toasting (Optional: You can also show inline errors)
  if (errors.amount) toast.error(errors.amount.message);
  if (errors.created_at) toast.error(errors.created_at.message);

  return (
    <div className="flex h-full flex-col justify-between gap-6 rounded-2xl bg-white p-6 shadow-sm">
      <div>
        <h2 className="mb-1 text-lg font-bold text-slate-700">Add Income</h2>
        <p className="text-sm text-slate-500">
          Track your monthly earnings to keep your budget accurate.
        </p>
      </div>

      <form
        id="income-form" // Link button to form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        {/* Date Input */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-600">
            Date Received
          </label>
          <input
            type="date"
            max={today} // HTML5 constraint
            disabled={isAddingIncome}
            {...register("created_at", {
              required: "Date is required",
              validate: (value) => value <= today || "Future dates not allowed",
            })}
            className="w-full rounded-lg border border-slate-200 bg-white p-3 text-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none disabled:bg-slate-100"
          />
          {errors.created_at && (
            <span className="text-xs text-red-500">
              {errors.created_at.message}
            </span>
          )}
        </div>

        {/* Amount Input */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-600">Amount</label>
          <input
            type="number"
            placeholder="e.g. 5000"
            min="0"
            step="0.01"
            disabled={isAddingIncome}
            onWheel={(e) => e.target.blur()}
            {...register("amount", {
              required: "Amount is required",
              min: { value: 0.01, message: "Income must be greater than zero" },
            })}
            className="w-full rounded-lg border border-slate-200 bg-white p-3 text-lg font-semibold text-slate-900 placeholder:text-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none disabled:bg-slate-100"
          />
          {errors.amount && (
            <span className="text-xs text-red-500">
              {errors.amount.message}
            </span>
          )}
        </div>
      </form>

      {/* Button */}
      {/* Note: form attribute links this button to the form tag above */}
      <button
        form="income-form"
        type="submit"
        disabled={isAddingIncome}
        className={`flex w-full cursor-pointer items-center justify-center rounded-xl py-3.5 text-sm font-bold tracking-wide transition-all duration-300 ${
          isAddingIncome
            ? "bg-slate-200 text-slate-400"
            : "cursor-pointer bg-indigo-600 text-white shadow-lg hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
        }`}
      >
        {isAddingIncome ? <LoaderMini /> : "Confirm Income"}
      </button>
    </div>
  );
}

export default IncomeForm;
