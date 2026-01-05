import { useForm } from "react-hook-form";
import { useCreateExpense } from "./useCreateExpense";
import { useUser } from "../authentication/useUser";
import LoaderMini from "../../ui/LoaderMini";

import toast from "react-hot-toast"; // Import Toast

import { useBalanceData } from "../wallet/useBalanceData";
import { useCurrency } from "../../context/CurrencyContext";
import { formatCurrency } from "../../utils/helpers";

function ExpenseForm({ categories, handleShowForm }) {
  const { register, handleSubmit, reset, getValues, formState } = useForm();
  const { createExpense, isCreating } = useCreateExpense();
  const { user } = useUser();
  const { currency } = useCurrency();

  // 1. Get Current Balance Data
  const { currentBalance } = useBalanceData();

  function onSubmit(data) {
    const expenseAmount = parseFloat(data.amount);

    // 2. THE CHECK: Block if amount > balance
    if (expenseAmount > currentBalance) {
      toast.error(
        `Insufficient funds! You only have ${formatCurrency(currentBalance, currency)} left.`,
      );
      reset();
      return; // Stop the function
    }

    createExpense({
      ...data,
      user_id: user.id,
    });
    console.log(data);
    reset();
    handleShowForm();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-wrap items-center gap-3 p-3"
    >
      <input
        type="date"
        id="date"
        required
        {...register("date")}
        className="h-10 w-40 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 placeholder-slate-400 transition-all duration-200 focus:ring focus:ring-indigo-500 focus:ring-offset-1 focus:outline-none"
      />

      <input
        type="text"
        id="title"
        required
        {...register("title")}
        placeholder="Enter expense title"
        className="h-10 w-48 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-900 placeholder-slate-400 transition-all duration-200 focus:ring focus:ring-indigo-500 focus:ring-offset-1 focus:outline-none"
      />

      <input
        type="number"
        id="amount"
        required
        {...register("amount")}
        placeholder="Enter amount"
        className="h-10 w-32 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 placeholder-slate-400 transition-all duration-200 focus:ring focus:ring-indigo-500 focus:ring-offset-1 focus:outline-none"
      />

      <select
        id="category_id"
        required
        defaultValue=""
        {...register("category_id")}
        className="h-10 w-40 flex-1 cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium placeholder-slate-400 transition-all duration-200 focus:ring focus:ring-indigo-500 focus:ring-offset-1 focus:outline-none"
      >
        <option value="" disabled>
          Select a category
        </option>
        {categories.map((category, key) => (
          <option key={key} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        id="notes"
        {...register("notes")}
        placeholder="Optional notes (e.g., Dinner with friends)"
        className="h-10 w-64 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder-slate-400 transition-all duration-200 focus:ring focus:ring-indigo-500 focus:ring-offset-1 focus:outline-none"
      />

      <button className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition-all duration-300 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none">
        {isCreating ? <LoaderMini /> : "Add"}
      </button>
    </form>
  );
}

export default ExpenseForm;
