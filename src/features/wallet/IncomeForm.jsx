import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAddIncome } from "./useAddIncome";
import { useEditIncome } from "./useEditIncome"; // <-- Import edit hook
import { useUser } from "../authentication/useUser";
import LoaderMini from "../../ui/LoaderMini";
import { useEffect } from "react";
import FormInput from "../../ui/FormInput";
import { format } from "date-fns";

function IncomeForm({ incomeToEdit = {}, onCloseModal }) {
  const { addIncome, isAddingIncome } = useAddIncome();
  const { editIncome, isEditing: isUpdating } = useEditIncome();
  const { user } = useUser();

  // Determine if we are Editing or Creating
  const { id: editId, ...editValues } = incomeToEdit;
  const isEditSession = Boolean(editId);
  const isWorking = isAddingIncome || isUpdating;

  const today = format(new Date(), "yyyy-MM-dd");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, submitCount },
  } = useForm({
    // If editing, load the values. Otherwise, use empty defaults.
    defaultValues: isEditSession
      ? editValues
      : { income: "", source: "", date: today }, // Changed 'amount' to 'income' for consistency
  });

  function onSubmit(data) {
    const payload = {
      income: parseFloat(data.income),
      date: data.date,
      source: data.source,
    };

    if (isEditSession) {
      editIncome(
        { id: editId, ...payload },
        { onSuccess: () => onCloseModal?.() }, // Close modal on success
      );
    } else {
      addIncome(
        { user_id: user.id, ...payload },
        { onSuccess: () => reset() }, // Clear form on success
      );
    }
  }

  // Robust Error Toasting
  useEffect(() => {
    if (submitCount > 0) {
      if (errors?.income?.message) toast.error(errors.income.message);
      if (errors?.source?.message) toast.error(errors.source.message);
      if (errors?.date?.message) toast.error(errors.date.message);
    }
  }, [errors, submitCount]);

  // --- THE SHARED FORM FIELDS ---
  const formFields = (
    <>
      <FormInput
        id="date"
        type="date"
        label="Date Received"
        max={today}
        disabled={isWorking}
        register={register("date", {
          required: "Please select a date",
          validate: (value) => value <= today || "Future dates are not allowed",
        })}
      />

      <FormInput
        id="source"
        type="text"
        label="Source"
        placeholder="e.g., Salary, Freelance, Gift"
        disabled={isWorking}
        register={register("source", {
          required: "Please specify an income source",
          minLength: { value: 2, message: "Source name is too short" },
        })}
      />

      <FormInput
        id="income"
        type="number"
        label="Amount"
        placeholder="0.00"
        step="0.01"
        disabled={isWorking}
        onWheel={(e) => e.target.blur()}
        register={register("income", {
          required: "Please enter an amount",
          min: { value: 0.01, message: "Income must be greater than 0" },
          valueAsNumber: true,
        })}
      />

      {/* Buttons change based on Edit vs Add */}
      {isEditSession ? (
        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={onCloseModal}
            disabled={isWorking}
            className="flex-1 cursor-pointer rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isWorking}
            className="flex flex-1 cursor-pointer items-center justify-center rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
          >
            {isWorking ? <LoaderMini /> : "Save Changes"}
          </button>
        </div>
      ) : (
        <button
          type="submit"
          disabled={isWorking}
          className={`flex w-full cursor-pointer items-center justify-center rounded-xl py-3.5 text-sm font-bold tracking-wide transition-all duration-300 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-none ${
            isWorking
              ? "cursor-not-allowed bg-slate-200 text-slate-400"
              : "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
          }`}
        >
          {isWorking ? <LoaderMini /> : "Confirm Income"}
        </button>
      )}
    </>
  );

  // If in a Modal (Edit Session), just return the naked form
  if (isEditSession) {
    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex w-[85vw] max-w-sm flex-col gap-5"
      >
        <h3 className="text-2xl font-black text-slate-900">Edit Income</h3>
        {formFields}
      </form>
    );
  }

  // If in the Dashboard/Wallet page (Add Session), return the styled Card wrapper
  return (
    <div className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/40">
      <div>
        <h2 className="mb-1 text-xl font-bold text-slate-900">Add Income</h2>
        <p className="text-sm font-medium text-slate-500">
          Track your monthly earnings to keep your budget accurate.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        {formFields}
      </form>
    </div>
  );
}

export default IncomeForm;
