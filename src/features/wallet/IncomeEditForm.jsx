import { useForm } from "react-hook-form";
import LoaderMini from "../../ui/LoaderMini";
import { useEditIncome } from "./useEditIncome";

function IncomeEditForm({ incomeItem, onClose, onSuccess }) {
  const { editIncome, isEditing: isUpdating } = useEditIncome();
  const { id, income, created_at } = incomeItem;

  // Get Today for max date
  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      income: income,
      created_at: new Date(created_at).toISOString().split("T")[0],
    },
  });

  function onSubmit(data) {
    editIncome(
      { ...data, id },
      {
        onSuccess: () => onSuccess(),
      },
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-[85vw] max-w-sm flex-col gap-5"
    >
      <h3 className="text-xl font-bold text-slate-800">Edit Income</h3>

      {/* Amount */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase">
          Amount
        </label>
        <input
          type="number"
          step="0.01"
          {...register("income", { required: true, min: 1 })}
          className="w-full rounded-lg border border-slate-200 p-2.5 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      {/* Date */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase">
          Date Received
        </label>
        <input
          type="date"
          max={today}
          {...register("created_at", {
            required: true,
            validate: (value) => value <= today || "Future dates not allowed",
          })}
          className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        {errors.created_at && (
          <span className="text-xs text-red-500">
            {errors.created_at.message}
          </span>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 cursor-pointer rounded-lg border border-slate-200 py-2.5 text-sm font-semibold hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          disabled={isUpdating}
          className="flex flex-1 cursor-pointer items-center justify-center rounded-lg bg-indigo-600 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
        >
          {isUpdating ? <LoaderMini /> : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export default IncomeEditForm;
