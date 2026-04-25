import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiMinusSm, HiPlusSm } from "react-icons/hi";
import { HiOutlineCreditCard } from "react-icons/hi2";

import ExpenseForm from "./ExpenseForm";
import Button from "../../ui/Button";

function NewExpense({ categories }) {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  function handleShowForm() {
    setShowForm((prev) => !prev);
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button onClick={handleShowForm} variant="primary">
          {showForm ? (
            <HiMinusSm className="h-5 w-5" />
          ) : (
            <HiPlusSm className="h-5 w-5" />
          )}
          <span>{showForm ? "Close expense form" : "New expense"}</span>
        </Button>

        <Button
          variant="secondary"
          onClick={() => navigate("/expense/subscriptions")}
        >
          <HiOutlineCreditCard className="h-5 w-5" />
          <span>Manage subscriptions</span>
        </Button>
      </div>

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
