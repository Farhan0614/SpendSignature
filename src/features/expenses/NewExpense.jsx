import { useState } from "react";
import { HiMinusSm, HiPlusSm } from "react-icons/hi";
import ExpenseForm from "./ExpenseForm";

function NewExpense({ categories }) {
  const [showForm, setShowForm] = useState(false);
  function handleShowForm() {
    setShowForm((showForm) => !showForm);
  }

  return (
    <div>
      <button
        onClick={handleShowForm}
        className="flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
      >
        {showForm ? (
          <HiMinusSm className="h-5 w-5" />
        ) : (
          <HiPlusSm className="h-5 w-5" />
        )}
        <span>New</span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          showForm
            ? "mt-4 max-h-[1000px] scale-100 opacity-100"
            : "max-h-0 scale-95 opacity-0"
        }`}
      >
        <ExpenseForm
          categories={categories}
          handleShowForm={handleShowForm}
          showForm={showForm}
        />
      </div>
    </div>
  );
}

export default NewExpense;
