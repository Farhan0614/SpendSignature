import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Hooks
import { useCreateExpense } from "./useCreateExpense";
import { useEditExpense } from "./useEditExpense";
import { useUser } from "../authentication/useUser";
import { usePredictAnomaly } from "./usePredictAnomaly";

// UI
import LoaderMini from "../../ui/LoaderMini";
import ConfirmAnomaly from "../../ui/ConfirmAnomaly";

function ExpenseForm({
  categories,
  handleShowForm,
  showForm,
  expenseToEdit = {},
}) {
  const { id: editId, ...editValues } = expenseToEdit;
  const isEditSession = Boolean(editId);
  // --- STATE ---
  // We use this to toggle between showing the Form and showing the Warning
  const [showAnomalyWarning, setShowAnomalyWarning] = useState(false);
  const [pendingData, setPendingData] = useState(null); // Store form data while waiting

  const today = new Date().toISOString().split("T")[0];
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: isEditSession ? editValues : { date: today },
  });

  const { createExpense, isCreating } = useCreateExpense();
  const { editExpense, isEditing } = useEditExpense();
  const { user } = useUser();
  const { isChecking, anomalyResult, predict, resetAnomaly } =
    usePredictAnomaly();

  const isWorking = isCreating || isEditing || isChecking;

  // --- RESET LOGIC ---
  useEffect(() => {
    if (!showForm) {
      reset();
      setShowAnomalyWarning(false);
      resetAnomaly();
    }
    // We intentionally ignore dependencies to prevent an infinite reset loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showForm]);

  useEffect(() => {
    if (errors?.amount?.message) toast.error(errors.amount.message);
    if (errors?.date?.message) toast.error(errors.date.message);
  }, [errors]);

  // --- 1. THE USER CLICKS "SAVE" ---
  function onSubmit(data) {
    const expenseAmount = parseFloat(data.amount);
    if (expenseAmount <= 0) return toast.error("Expense must be positive");

    // Store data temporarily in case we need to show the warning
    setPendingData(data);

    // Call the AI Hook
    predict({
      amount: expenseAmount,
      categoryId: data.category_id,
      // Scenario A: AI says it's normal -> Save immediately
      onSuccessNormal: () => finalSave(data),
      // Scenario B: AI says weird -> Show Warning UI
      onAnomaly: () => setShowAnomalyWarning(true),
    });
  }

  // --- 2. THE FINAL SAVE (Called either immediately or after confirming warning) ---
  function finalSave(data) {
    const payload = isEditSession
      ? { ...data, id: editId }
      : { ...data, user_id: user.id };

    const action = isEditSession ? editExpense : createExpense;

    action(payload, {
      onSuccess: () => {
        reset();
        setShowAnomalyWarning(false); // Close warning if open
        handleShowForm();
      },
    });
  }

  // --- RENDER: ANOMALY WARNING MODE ---
  // If AI flagged it, we hide the form and show the warning
  if (showAnomalyWarning && anomalyResult) {
    return (
      <ConfirmAnomaly
        message={anomalyResult.message}
        amount={pendingData?.amount}
        onConfirm={() => finalSave(pendingData)} // User says "Save Anyway"
        onCancel={() => setShowAnomalyWarning(false)} // User says "Let me fix it"
        isSaving={isCreating || isEditing}
      />
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

      {/* BUTTONS ROW */}
      <div className="mt-2 flex items-center justify-end gap-2 sm:col-span-2 lg:col-span-6">
        {isEditSession && (
          <button
            type="button"
            onClick={handleShowForm}
            disabled={isWorking}
            className="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
          >
            Cancel
          </button>
        )}

        <button
          disabled={isWorking}
          className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 font-bold text-white transition-all hover:bg-indigo-700 hover:shadow-md disabled:bg-indigo-300 sm:w-auto"
        >
          {isWorking ? (
            <LoaderMini />
          ) : isEditSession ? (
            "Save Changes"
          ) : (
            "Add Transaction"
          )}
        </button>
      </div>
    </form>
  );
}

export default ExpenseForm;
