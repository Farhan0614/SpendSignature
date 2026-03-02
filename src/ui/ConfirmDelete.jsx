import { FaTrash } from "react-icons/fa";
import LoaderMini from "./LoaderMini";
import Button from "./Button";

function ConfirmDelete({
  resourceName,
  onConfirm,
  disabled,
  onCancel,
  message = "This action cannot be undone.",
}) {
  return (
    <div className="flex w-[85vw] max-w-sm flex-col items-center gap-6 py-4 text-center">
      <div className="rounded-full bg-red-100 p-4 text-red-600">
        <FaTrash size={24} />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-bold text-slate-800">
          Delete {resourceName}?
        </h3>
        <p className="text-sm text-slate-500">{message}</p>
      </div>

      <div className="flex w-full gap-3">
        <Button
          variant="secondary"
          onClick={onCancel}
          className="flex-1 py-2.5"
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          disabled={disabled}
          className="flex-1 py-2.5"
        >
          {disabled ? <LoaderMini /> : "Delete"}
        </Button>
      </div>
    </div>
  );
}

export default ConfirmDelete;
