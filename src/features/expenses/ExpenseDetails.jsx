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
import { format } from "date-fns";
import Button from "../../ui/Button";

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
    created_at,
    categories: { name: category_name, icon_name },
  } = expense;

  const Icon = useIcon(icon_name);

  if (isEditing) {
    return (
      <div className="w-[90vw] max-w-4xl">
        <h2 className="mb-6 text-2xl font-black text-slate-900 dark:text-white">
          Edit Expense
        </h2>
        <ExpenseForm
          categories={categories}
          expenseToEdit={expense}
          handleShowForm={() => setIsEditing(false)}
        />
      </div>
    );
  }

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

  return (
    <div className="flex w-[85vw] max-w-md flex-col gap-6 pt-2">
      {/* Header & Icon */}
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 shadow-inner dark:from-indigo-900 dark:to-indigo-800 dark:text-indigo-200">
          {Icon && <Icon size={36} />}
        </div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          {formattedTitle(title)}
        </h2>
      </div>

      {/* Soft Stats Grid */}
      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
        <div className="flex flex-col items-center justify-center gap-1 text-center">
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            <FaHashtag className="mr-1 inline" />
            Amount
          </span>
          <span className="font-sans font-black text-rose-600 dark:text-rose-400">
            {formatCurrency(amount, currency)}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 border-x border-slate-200/60 px-2 text-center dark:border-slate-700">
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            <FaCalendar className="mr-1 inline" />
            Date
          </span>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
            {formattedFullDate(date)}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 text-center">
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            <FaTag className="mr-1 inline" />
            Category
          </span>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
            {category_name}
          </span>
        </div>
      </div>

      {/* Notes Section */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-2 flex items-center gap-2 text-slate-400">
          <MdNotes className="h-5 w-5" />
          <span className="text-xs font-bold tracking-wider uppercase">
            Notes
          </span>
        </div>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {notes || (
            <span className="text-slate-400 italic">No notes provided.</span>
          )}
        </p>
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-2 flex gap-3">
        <Button
          variant="soft-primary"
          onClick={() => setIsEditing(true)}
          className="flex-1 py-3"
        >
          <FaPencilAlt size={14} /> Edit
        </Button>
        <Button
          variant="soft-danger"
          onClick={() => setIsConfirmingDelete(true)}
          className="flex-1 py-3"
        >
          <FaTrash size={14} /> Delete
        </Button>
      </div>

      {/* NEW: Audit Trail / Entry Date */}
      <div className="mt-1 text-center">
        <p className="text-[12px] font-medium text-slate-400">
          Entry added on{" "}
          {format(new Date(created_at), "MMM dd, yyyy 'at' hh:mm a")}
        </p>
      </div>
    </div>
  );
}

export default ExpenseDetails;
