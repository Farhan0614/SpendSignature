import { useForm } from "react-hook-form";
import LoaderMini from "../../ui/LoaderMini";
import { useEditIncome } from "./useEditIncome";
import FormInput from "../../ui/FormInput";

function IncomeEditForm({ incomeItem, onClose, onSuccess }) {
  const { editIncome, isEditing: isUpdating } = useEditIncome();
  const { id, income, date, source } = incomeItem;

  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      income: income,
      source: source,
      date: date,
    },
  });

  function onSubmit(data) {
    editIncome(
      {
        id,
        income: parseFloat(data.income),
        date: data.date,
        source: data.source,
      },
      {
        onSuccess: () => onSuccess(),
      },
    );
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex w-[85vw] max-w-sm flex-col gap-5"
    >
      <h3 className="text-2xl font-black text-slate-900">Edit Income</h3>

      <FormInput
        id="date"
        type="date"
        label="Date Received"
        max={today}
        error={errors.date?.message} // Pass inline errors down to the component
        register={register("date", {
          required: "Date is required",
          validate: (value) => value <= today || "Future dates not allowed",
        })}
      />

      <FormInput
        id="source"
        type="text"
        label="Source"
        error={errors.source?.message}
        register={register("source", { required: "Source is required" })}
      />

      <FormInput
        id="amount"
        type="number"
        step="0.01"
        label="Amount"
        onWheel={(e) => e.target.blur()}
        error={errors.income?.message}
        register={register("income", {
          required: "Amount is required",
          min: 1,
        })}
      />

      {/* Buttons */}
      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 cursor-pointer rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
        >
          Cancel
        </button>
        <button
          disabled={isUpdating}
          className="flex flex-1 cursor-pointer items-center justify-center rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
        >
          {isUpdating ? <LoaderMini /> : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export default IncomeEditForm;
