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
import { format } from "date-fns";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";

function ExpenseForm({
  categories,
  handleShowForm,
  showForm,
  expenseToEdit = {},
  defaultDate,
  onCloseModal,
}) {
  const { id: editId, ...editValues } = expenseToEdit;
  const isEditSession = Boolean(editId);
  // --- STATE ---
  const [showAnomalyWarning, setShowAnomalyWarning] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  const today = format(new Date(), "yyyy-MM-dd");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, submitCount },
  } = useForm({
    defaultValues: isEditSession ? editValues : { date: defaultDate || today },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showForm]);

  // --- FIX: ADDED MISSING ERROR TOASTS ---
  useEffect(() => {
    if (submitCount > 0) {
      if (errors?.date?.message)
        toast.error(errors.date.message, { id: "exp-date" });
      if (errors?.title?.message)
        toast.error(errors.title.message, { id: "exp-title" });
      if (errors?.amount?.message)
        toast.error(errors.amount.message, { id: "exp-amount" });
      if (errors?.category_id?.message)
        toast.error(errors.category_id.message, { id: "exp-cat" });
    }
  }, [errors, submitCount]);

  // --- 1. THE USER CLICKS "SAVE" ---
  function onSubmit(data) {
    const expenseAmount = parseFloat(data.amount);
    if (expenseAmount <= 0) return toast.error("Expense must be positive");

    setPendingData(data);

    predict({
      amount: expenseAmount,
      categoryId: data.category_id,
      onSuccessNormal: () => finalSave(data),
      onAnomaly: () => setShowAnomalyWarning(true),
    });
  }

  // --- 2. THE FINAL SAVE ---
  function finalSave(data) {
    const payload = isEditSession
      ? { ...data, id: editId }
      : { ...data, user_id: user.id };

    const action = isEditSession ? editExpense : createExpense;

    action(payload, {
      onSuccess: () => {
        reset();
        setShowAnomalyWarning(false);
        if (handleShowForm) handleShowForm();
        if (onCloseModal) onCloseModal();
      },
    });
  }

  // --- RENDER: ANOMALY WARNING MODE ---
  if (showAnomalyWarning && anomalyResult) {
    return (
      <ConfirmAnomaly
        message={anomalyResult.message}
        amount={pendingData?.amount}
        onConfirm={() => finalSave(pendingData)}
        onCancel={() => setShowAnomalyWarning(false)}
        isSaving={isCreating || isEditing}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="grid grid-cols-1 items-end gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/40 sm:grid-cols-2 lg:grid-cols-6 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-900/50"
    >
      {/* Date Input */}
      <FormInput
        id="date"
        type="date"
        label="Date"
        max={today}
        className="lg:col-span-1"
        register={register("date", {
          required: "Date is required",
          validate: (value) => value <= today || "No future dates",
        })}
      />

      {/* Title */}
      <FormInput
        id="title"
        type="text"
        label="Title"
        placeholder="Expense Title"
        className="lg:col-span-2"
        register={register("title", { required: "Title is required" })}
      />

      {/* Amount */}
      <FormInput
        id="amount"
        type="number"
        label="Amount"
        placeholder="0.00"
        step="0.01"
        min="0"
        className="lg:col-span-1"
        register={register("amount", {
          required: "Amount is required",
          min: { value: 0.01, message: "Amount must be positive" },
        })}
      />

      {/* Category */}
      <FormInput
        id="category_id"
        type="select"
        label="Category"
        defaultValue=""
        className="lg:col-span-1"
        register={register("category_id", {
          required: "Please select a category",
        })}
      >
        <option value="" disabled>
          Select
        </option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </FormInput>

      {/* Notes */}
      <FormInput
        id="notes"
        type="text"
        label="Notes"
        autoComplete="off"
        placeholder="Optional"
        className="sm:col-span-2 lg:col-span-1"
        register={register("notes")}
      />

      {/* BUTTONS ROW */}
      <div className="mt-2 flex items-center justify-end gap-2 sm:col-span-2 lg:col-span-6">
        {isEditSession && (
          <Button
            type="button"
            variant="secondary"
            onClick={handleShowForm}
            disabled={isWorking}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          disabled={isWorking}
          className="w-full sm:w-auto"
        >
          {isWorking ? (
            <LoaderMini />
          ) : isEditSession ? (
            "Save Changes"
          ) : (
            "Add Transaction"
          )}
        </Button>
      </div>
    </form>
  );
}

export default ExpenseForm;
