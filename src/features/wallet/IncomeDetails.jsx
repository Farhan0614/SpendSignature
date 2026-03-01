import { useState } from "react";
import { format } from "date-fns";
import { FaTrash, FaPencilAlt, FaCalendar, FaHashtag } from "react-icons/fa";
import { HiArrowDownLeft } from "react-icons/hi2";
import { useCurrency } from "../../context/CurrencyContext";
import { formatCurrency } from "../../utils/helpers";
import { useDeleteIncome } from "./useDeleteIncome";
import ConfirmDelete from "../../ui/ConfirmDelete";
import IncomeEditForm from "./IncomeEditForm";

function IncomeDetails({ incomeItem, onCloseModal }) {
  const { currency } = useCurrency();
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const { deleteIncome, isDeleting } = useDeleteIncome();

  const { id, income, date, source, created_at } = incomeItem;

  if (isConfirmingDelete) {
    return (
      <ConfirmDelete
        resourceName="Income"
        onConfirm={() => deleteIncome(id, { onSuccess: onCloseModal })}
        onCancel={() => setIsConfirmingDelete(false)}
        disabled={isDeleting}
        message={`Are you sure you want to delete the income from "${source}"?`}
      />
    );
  }

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

  return (
    <div className="flex w-[85vw] max-w-md flex-col gap-6 pt-2">
      {/* Header & Icon (Green Theme) */}
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 shadow-inner">
          <HiArrowDownLeft size={36} strokeWidth={2} />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900">
          {source || "Income"}
        </h2>
      </div>

      {/* Soft Stats Grid (Matches Expense Grid but 2 columns) */}
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-4">
        <div className="flex flex-col items-center justify-center gap-1 border-r border-slate-200/60 text-center">
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            <FaHashtag className="mr-1 inline" />
            Amount
          </span>
          <span className="font-sans font-black text-emerald-600">
            +{formatCurrency(income, currency)}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 text-center">
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            <FaCalendar className="mr-1 inline" />
            Date
          </span>
          <span className="text-sm font-bold text-slate-700">
            {format(new Date(date), "MMM dd, yyyy")}
          </span>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-2 flex gap-3">
        <button
          onClick={() => setIsEditing(true)}
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-100 py-3 font-bold text-slate-700 transition-colors hover:bg-slate-200 focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:outline-none"
        >
          <FaPencilAlt size={14} /> Edit
        </button>
        <button
          onClick={() => setIsConfirmingDelete(true)}
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-rose-50 py-3 font-bold text-rose-600 transition-colors hover:bg-rose-100 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
        >
          <FaTrash size={14} /> Delete
        </button>
      </div>

      {/* Audit Trail / Entry Date */}
      <div className="mt-1 text-center">
        <p className="text-[11px] font-medium text-slate-400">
          Recorded on{" "}
          {format(new Date(created_at), "MMM dd, yyyy 'at' hh:mm a")}
        </p>
      </div>
    </div>
  );
}

export default IncomeDetails;
