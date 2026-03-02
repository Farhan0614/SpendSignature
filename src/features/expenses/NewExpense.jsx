import { useState } from "react";
import { HiMinusSm, HiPlusSm } from "react-icons/hi";
import ExpenseForm from "./ExpenseForm";
import Button from "../../ui/Button";

function NewExpense({ categories }) {
  const [showForm, setShowForm] = useState(false);
  function handleShowForm() {
    setShowForm((showForm) => !showForm);
  }

  return (
    <div>
      <Button onClick={handleShowForm} variant="primary">
        {showForm ? (
          <HiMinusSm className="h-5 w-5" />
        ) : (
          <HiPlusSm className="h-5 w-5" />
        )}
        <span>New Expense</span>
      </Button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          showForm
            ? "mt-6 max-h-[1000px] scale-100 opacity-100"
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
