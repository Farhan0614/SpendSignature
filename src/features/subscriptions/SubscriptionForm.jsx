import { useForm } from "react-hook-form";
import { format } from "date-fns";
import Loader from "../../ui/Loader";
import LoaderMini from "../../ui/LoaderMini";
import Button from "../../ui/Button";
import FormInput from "../../ui/FormInput";
import { useUser } from "../authentication/useUser";
import { useCategories } from "../categories/useCategories";
import { useCreateSubscription } from "./useCreateSubscription";
import { useUpdateSubscription } from "./useUpdateSubscription";

function SubscriptionForm({ subscriptionToEdit = {}, onCloseForm }) {
  const { user } = useUser();
  const { categories, isLoading: loadingCategories } = useCategories();
  const { createSubscription, isCreating } = useCreateSubscription();
  const { updateSubscription, isUpdating } = useUpdateSubscription();

  const { id: editId } = subscriptionToEdit;
  const isEditSession = Boolean(editId);

  const defaultValues = isEditSession
    ? {
        title: subscriptionToEdit.title,
        amount: subscriptionToEdit.amount,
        category_id: subscriptionToEdit.category_id,
        next_due_date: subscriptionToEdit.next_due_date,
        interval_months: subscriptionToEdit.interval_months,
        notes: subscriptionToEdit.notes || "",
        status: subscriptionToEdit.status,
      }
    : {
        title: "",
        amount: "",
        category_id: "",
        next_due_date: format(new Date(), "yyyy-MM-dd"),
        interval_months: 1,
        notes: "",
        status: "active",
      };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  const isWorking = isCreating || isUpdating;

  if (loadingCategories) return <Loader />;

  function onSubmit(data) {
    const payload = {
      title: data.title.trim(),
      amount: Number(data.amount),
      category_id: Number(data.category_id),
      next_due_date: data.next_due_date,
      interval_months: Number(data.interval_months),
      notes: data.notes?.trim() || null,
      status: data.status,
    };

    const onSuccess = () => {
      reset(defaultValues);
      onCloseForm?.();
    };

    if (isEditSession) {
      updateSubscription({ id: editId, ...payload }, { onSuccess });
    } else {
      createSubscription({ user_id: user.id, ...payload }, { onSuccess });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-900/50"
    >
      <div className="mb-6">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          {isEditSession ? "Edit Subscription" : "Create Subscription"}
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Save recurring bills like Netflix, rent, internet, gym, or SaaS tools.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormInput
          label="Subscription Title"
          id="title"
          register={register("title", {
            required: "Title is required",
            minLength: { value: 2, message: "Minimum 2 characters" },
          })}
          error={errors?.title?.message}
          disabled={isWorking}
          placeholder="Netflix"
        />

        <FormInput
          label="Amount"
          id="amount"
          type="number"
          step="0.01"
          min="0.01"
          register={register("amount", {
            required: "Amount is required",
            min: { value: 0.01, message: "Amount must be greater than 0" },
          })}
          error={errors?.amount?.message}
          disabled={isWorking}
          placeholder="19.99"
        />

        <FormInput
          label="Category"
          id="category_id"
          type="select"
          register={register("category_id", {
            required: "Please select a category",
          })}
          error={errors?.category_id?.message}
          disabled={isWorking}
        >
          <option value="">Select category</option>
          {categories?.map((category) => (
            <option value={category.id} key={category.id}>
              {category.name}
            </option>
          ))}
        </FormInput>

        <FormInput
          label="Next Due Date"
          id="next_due_date"
          type="date"
          register={register("next_due_date", {
            required: "Next due date is required",
          })}
          error={errors?.next_due_date?.message}
          disabled={isWorking}
        />

        <FormInput
          label="Billing Cycle"
          id="interval_months"
          type="select"
          register={register("interval_months", {
            required: "Billing cycle is required",
          })}
          error={errors?.interval_months?.message}
          disabled={isWorking}
        >
          <option value="1">Monthly</option>
          <option value="3">Quarterly</option>
          <option value="6">Every 6 Months</option>
          <option value="12">Yearly</option>
        </FormInput>

        <FormInput
          label="Status"
          id="status"
          type="select"
          register={register("status", {
            required: "Status is required",
          })}
          error={errors?.status?.message}
          disabled={isWorking}
        >
          <option value="active">Active</option>
          <option value="cancelled">Cancelled</option>
        </FormInput>
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
          Notes
        </label>
        <textarea
          rows={4}
          disabled={isWorking}
          placeholder="Optional notes for this recurring expense..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-700 transition-all outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:bg-slate-800 dark:disabled:border-slate-800 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
          {...register("notes")}
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={() => onCloseForm?.()}
          disabled={isWorking}
        >
          Cancel
        </Button>

        <Button type="submit" variant="primary" disabled={isWorking}>
          {isWorking ? (
            <LoaderMini />
          ) : isEditSession ? (
            "Save Changes"
          ) : (
            "Create Subscription"
          )}
        </Button>
      </div>
    </form>
  );
}

export default SubscriptionForm;
