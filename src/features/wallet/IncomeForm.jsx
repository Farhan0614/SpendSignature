import { useState } from "react";
import { useAddIncome } from "./useAddIncome";
import { useUser } from "../authentication/useUser";

import LoaderMini from "../../ui/LoaderMini";

function IncomeForm() {
  const [amount, setAmount] = useState("");
  const { addIncome, isAddingIncome } = useAddIncome();
  const { user } = useUser();

  const currentMonth = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  function handleIncomeClick() {
    if (amount === "") return;

    addIncome({
      month,
      year,
      user_id: user.id,
      income: amount,
    });

    setAmount("");
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-md">
      <h2 className="text-lg font-semibold text-gray-800">
        Add Monthly Income
      </h2>

      <div className="rounded-xl bg-gray-100 p-3 text-center font-medium text-gray-600">
        {currentMonth}
      </div>

      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        placeholder="Enter monthly income"
        className="rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />

      <button
        onClick={handleIncomeClick}
        className="flex cursor-pointer items-center justify-center rounded-[8px] bg-indigo-600 px-4 py-2 font-mono font-bold text-white transition-all duration-300 hover:bg-indigo-500 focus:ring focus:ring-indigo-400 focus:ring-offset-1 focus:outline-none"
      >
        {isAddingIncome ? <LoaderMini /> : " Add Income"}
      </button>
    </div>
  );
}

export default IncomeForm;
