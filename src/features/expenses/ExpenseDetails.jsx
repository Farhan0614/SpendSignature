import { useState } from "react";
import { useCurrency } from "../../context/CurrencyContext";
import {
  formatCurrency,
  formattedFullDate,
  formattedTitle,
} from "../../utils/helpers";
import {
  FaCalendar,
  FaHashtag,
  FaTag,
  FaPencilAlt,
  FaTrash,
} from "react-icons/fa";
import { MdNotes } from "react-icons/md";
import { useIcon } from "../../hooks/useIcon";
import { useDeleteExpense } from "./useDeleteExpense";
import ExpenseForm from "./ExpenseForm";
import { useCategories } from "../categories/useCategories";
import ConfirmDelete from "../../ui/ConfirmDelete";

function ExpenseDetails({ expense, onCloseModal }) {
  const { currency } = useCurrency();
  const { categories } = useCategories();

  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const { deleteExpense, isDeleting } = useDeleteExpense();

  const {
    id,
    amount,
    date,
    notes,
    title,
    categories: { name: category_name, icon_name },
  } = expense;

  const Icon = useIcon(icon_name);

  // --- 1. EDIT MODE (Wide & Large) ---
  if (isEditing) {
    return (
      <div className="w-[90vw] max-w-4xl">
        {" "}
        {/* Huge width for Form */}
        <h2 className="mb-4 text-xl font-bold text-slate-800">Edit Expense</h2>
        <ExpenseForm
          categories={categories}
          expenseToEdit={expense}
          handleShowForm={() => setIsEditing(false)}
        />
      </div>
    );
  }

  // --- 2. DELETE MODE (Wider & Short) ---
  if (isConfirmingDelete) {
    return (
      <ConfirmDelete
        resourceName="Expense"
        message={`Are you sure you want to delete "${title}"?`}
        onConfirm={() => deleteExpense(id, { onSuccess: onCloseModal })}
        onCancel={() => setIsConfirmingDelete(false)}
        disabled={isDeleting}
      />
    );
  }

  // --- 3. DEFAULT DETAILS MODE (Standard Width) ---
  return (
    <div className="flex w-[85vw] max-w-lg flex-col gap-8">
      {/* Header & Icon */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          {Icon && <Icon size={48} />}
        </div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900">
          {formattedTitle(title)}
        </h2>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-3 divide-x divide-slate-100 border-y border-slate-100 py-6">
        <div className="flex flex-col items-center gap-1 px-2 text-center">
          <span className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase">
            <FaHashtag /> Amount
          </span>
          <span className="font-bold text-slate-700">
            {formatCurrency(amount, currency)}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 px-2 text-center">
          <span className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase">
            <FaCalendar /> Date
          </span>
          <span className="font-bold text-slate-700">
            {formattedFullDate(date)}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 px-2 text-center">
          <span className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase">
            <FaTag /> Category
          </span>
          <span className="font-bold text-slate-700">{category_name}</span>
        </div>
      </div>

      {/* Notes Section */}
      <div className="rounded-xl bg-slate-50 p-6">
        <div className="mb-2 flex items-center gap-2 text-slate-500">
          <MdNotes className="h-5 w-5" />
          <span className="text-sm font-bold tracking-wide uppercase">
            Notes
          </span>
        </div>
        <p className="text-sm text-slate-600 italic">
          {notes || "No notes provided."}
        </p>
      </div>

      {/* BOTTOM RIGHT ACTION BUTTONS */}
      <div className="mt-4 flex justify-end gap-3 pt-4">
        <button
          onClick={() => setIsEditing(true)}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-50 px-5 py-3 font-semibold text-indigo-600 transition-colors hover:bg-indigo-100 hover:text-indigo-700"
          title="Edit Expense"
        >
          <FaPencilAlt size={18} />
          <span>Edit</span>
        </button>

        <button
          onClick={() => setIsConfirmingDelete(true)}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-red-50 px-5 py-3 font-semibold text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
          title="Delete Expense"
        >
          <FaTrash size={18} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}

export default ExpenseDetails;
