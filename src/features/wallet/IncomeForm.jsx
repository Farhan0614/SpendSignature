import { useState } from "react";
import toast from "react-hot-toast";
import { useAddIncome } from "./useAddIncome";
import { useUser } from "../authentication/useUser";
import LoaderMini from "../../ui/LoaderMini";

function IncomeForm() {
  const [amount, setAmount] = useState("");
  const { addIncome, isAddingIncome } = useAddIncome();
  const { user } = useUser();

  const currentMonthDisplay = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  function handleIncomeClick() {
    if (!amount) return;

    const value = parseFloat(amount);
    if (value <= 0) {
      toast.error("Income must be greater than zero");
      return;
    }

    addIncome(
      { month, year, user_id: user.id, income: value },
      {
        onSuccess: () => {
          setAmount(""); // Only clear form. Let the hook handle the Toast.
        },
      },
    );
  }

  // Helper boolean for button state
  const isDisabled = isAddingIncome || !amount;

  return (
    <div className="flex h-full flex-col justify-between gap-6 rounded-2xl bg-white p-6 shadow-sm">
      <div>
        <h2 className="mb-1 text-lg font-bold text-slate-700">Add Income</h2>
        <p className="text-sm text-slate-500">
          Track your monthly earnings to keep your budget accurate.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Date Display */}
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
          <span className="text-sm font-semibold text-slate-500">
            For Month
          </span>
          <span className="font-bold text-slate-700">
            {currentMonthDisplay}
          </span>
        </div>

        {/* Input Field */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600">Amount</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            min="0"
            placeholder="e.g. 5000"
            disabled={isAddingIncome}
            className="w-full rounded-lg border border-slate-200 bg-white p-3 text-lg font-semibold text-slate-900 placeholder:text-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none disabled:bg-slate-100"
          />
        </div>
      </div>

      {/* Button Matching Settings Page Style */}
      <button
        onClick={handleIncomeClick}
        disabled={isDisabled}
        className={`flex w-full cursor-pointer items-center justify-center rounded-xl py-3.5 text-sm font-bold tracking-wide transition-all duration-300 ${
          isDisabled
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
