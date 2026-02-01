import { useState } from "react";
import { format } from "date-fns";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import { useCurrency } from "../../context/CurrencyContext";
import { formatCurrency } from "../../utils/helpers";
import { useDeleteIncome } from "./useDeleteIncome";

// Imports from Refactoring
import ConfirmDelete from "../../ui/ConfirmDelete";
import IncomeEditForm from "./IncomeEditForm";

function IncomeDetails({ incomeItem, onCloseModal }) {
  const { currency } = useCurrency();
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const { deleteIncome, isDeleting } = useDeleteIncome();
  const { id, income, created_at } = incomeItem;

  // 1. DELETE MODE (Using Reusable Component)
  if (isConfirmingDelete) {
    return (
      <ConfirmDelete
        resourceName="Income"
        onConfirm={() => deleteIncome(id, { onSuccess: onCloseModal })}
        onCancel={() => setIsConfirmingDelete(false)}
        disabled={isDeleting}
        message="This will remove it from your budget history."
      />
    );
  }

  // 2. EDIT MODE (Using Extracted Component)
  if (isEditing) {
    return (
      <IncomeEditForm
        incomeItem={incomeItem}
        onClose={() => setIsEditing(false)}
        onSuccess={() => {
          setIsEditing(false);
          onCloseModal();
        }}
      />
    );
  }

  // 3. VIEW MODE
  return (
    <div className="flex w-[85vw] max-w-sm flex-col items-center gap-8 py-4">
      <div className="text-center">
        <span className="text-xs font-bold text-slate-400 uppercase">
          Income Amount
        </span>
        <h2 className="text-4xl font-black tracking-tight text-green-600">
          {formatCurrency(income, currency)}
        </h2>
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className="text-xs font-bold text-slate-400 uppercase">
          Date Received
        </span>
        <span className="text-lg font-bold text-slate-700">
          {format(new Date(created_at), "MMMM dd, yyyy")}
        </span>
      </div>

      <div className="flex w-full gap-3">
        <button
          onClick={() => setIsEditing(true)}
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-50 py-3 text-sm font-bold text-indigo-600 hover:bg-indigo-100"
        >
          <FaPencilAlt /> Edit
        </button>
        <button
          onClick={() => setIsConfirmingDelete(true)}
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-50 py-3 text-sm font-bold text-red-600 hover:bg-red-100"
        >
          <FaTrash /> Delete
        </button>
      </div>
    </div>
  );
}

export default IncomeDetails;
