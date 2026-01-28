import { useForm } from "react-hook-form";
import { useCreateExpense } from "./useCreateExpense";
import { useUser } from "../authentication/useUser";
import LoaderMini from "../../ui/LoaderMini";
import toast from "react-hot-toast";
import { useEffect } from "react";

function ExpenseForm({ categories, handleShowForm, showForm }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { createExpense, isCreating } = useCreateExpense();
  const { user } = useUser();

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!showForm) {
      reset();
    }
  }, [showForm, reset]);

  useEffect(() => {
    if (errors?.amount?.message) {
      toast.error(errors.amount.message);
    }
    if (errors?.date?.message) {
      toast.error(errors.date.message);
    }
  }, [errors]);

  function onSubmit(data) {
    const expenseAmount = parseFloat(data.amount);

    if (expenseAmount <= 0) {
      toast.error("Expense must be greater than 0");
      return;
    }

    createExpense(
      { ...data, user_id: user.id },
      {
        onSuccess: () => {
          reset();
          handleShowForm();
        },
      },
    );
  }

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 items-end gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-6"
    >
      {/* Date Input */}
      <div className="lg:col-span-1">
        <label className="mb-1 block text-xs font-semibold text-slate-500">
          Date
        </label>
        <input
          type="date"
          required
          max={today}
          {...register("date", {
            required: "Date is required",
            validate: (value) =>
              value <= today || "You cannot add future expenses",
          })}
          className={inputClass}
        />
      </div>

      {/* Title */}
      <div className="lg:col-span-2">
        <label className="mb-1 block text-xs font-semibold text-slate-500">
          Title
        </label>
        <input
          type="text"
          required
          placeholder="Expense Title"
          {...register("title")}
          className={inputClass}
        />
      </div>

      {/* Amount */}
      <div className="lg:col-span-1">
        <label className="mb-1 block text-xs font-semibold text-slate-500">
          Amount
        </label>
        <input
          type="number"
          placeholder="0.00"
          step="0.01"
          min="0"
          {...register("amount", {
            required: "This field is required",
            min: {
              value: 0.01,
              message: "Amount must be positive",
            },
          })}
          className={inputClass}
        />
      </div>

      {/* Category */}
      <div className="lg:col-span-1">
        <label className="mb-1 block text-xs font-semibold text-slate-500">
          Category
        </label>
        <select
          required
          defaultValue=""
          {...register("category_id")}
          className={inputClass}
        >
          <option value="" disabled>
            Select
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div className="sm:col-span-2 lg:col-span-1">
        <label className="mb-1 block text-xs font-semibold text-slate-500">
          Notes
        </label>
        <input
          type="text"
          placeholder="Optional"
          {...register("notes")}
          className={inputClass}
        />
      </div>

      {/* Submit Button */}
      <div className="mt-2 flex justify-end sm:col-span-2 lg:col-span-6">
        <button className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 font-bold text-white transition-all hover:bg-indigo-700 hover:shadow-md disabled:bg-indigo-300 sm:w-auto">
          {isCreating ? <LoaderMini /> : "Add Transaction"}
        </button>
      </div>
    </form>
  );
}

export default ExpenseForm;
