import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAddIncome } from "./useAddIncome";
import { useUser } from "../authentication/useUser";
import LoaderMini from "../../ui/LoaderMini";
import { useEffect } from "react";
import FormInput from "../../ui/FormInput";

function IncomeForm() {
  const { addIncome, isAddingIncome } = useAddIncome();
  const { user } = useUser();

  const today = new Date().toISOString().split("T")[0];

  // 1. Setup React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, submitCount },
  } = useForm({
    defaultValues: {
      amount: "",
      source: "",
      date: today,
    },
  });

  // 2. Submit Handler
  function onSubmit(data) {
    const value = parseFloat(data.amount);

    addIncome(
      {
        user_id: user.id,
        income: value,
        date: data.date,
        source: data.source,
      },
      {
        onSuccess: () => reset(),
      },
    );
  }

  // 3. Robust Error Toasting
  // Adding submitCount to dependencies ensures the toast fires every time the user clicks submit with invalid data
  useEffect(() => {
    // Only fire toasts if there actually was a submit attempt to prevent toasts on initial load
    if (submitCount > 0) {
      if (errors?.amount?.message) toast.error(errors.amount.message);
      if (errors?.source?.message) toast.error(errors.source.message);
      if (errors?.date?.message) toast.error(errors.date.message);
    }
  }, [errors, submitCount]);

  return (
    <div className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/40">
      <div>
        <h2 className="mb-1 text-xl font-bold text-slate-900">Add Income</h2>
        <p className="text-sm font-medium text-slate-500">
          Track your monthly earnings to keep your budget accurate.
        </p>
      </div>

      <form
        id="income-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        <FormInput
          id="date"
          type="date"
          label="Date Received"
          max={today}
          disabled={isAddingIncome}
          register={register("date", {
            required: "Please select a date",
            validate: (value) =>
              value <= today || "Future dates are not allowed",
          })}
        />

        <FormInput
          id="source"
          type="text"
          label="Source"
          placeholder="e.g., Salary, Freelance, Gift"
          disabled={isAddingIncome}
          register={register("source", {
            required: "Please specify an income source",
            minLength: { value: 2, message: "Source name is too short" },
          })}
        />

        <FormInput
          id="amount"
          type="number"
          label="Amount"
          placeholder="0.00"
          step="0.01"
          disabled={isAddingIncome}
          onWheel={(e) => e.target.blur()}
          register={register("amount", {
            required: "Please enter an amount",
            min: { value: 0.01, message: "Income must be greater than 0" },
            valueAsNumber: true,
          })}
        />
      </form>

      <button
        form="income-form"
        type="submit"
        disabled={isAddingIncome}
        className={`flex w-full cursor-pointer items-center justify-center rounded-xl py-3.5 text-sm font-bold tracking-wide transition-all duration-300 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-none ${
          isAddingIncome
            ? "cursor-not-allowed bg-slate-200 text-slate-400"
            : "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
        }`}
      >
        {isAddingIncome ? <LoaderMini /> : "Confirm Income"}
      </button>
    </div>
  );
}

export default IncomeForm;
