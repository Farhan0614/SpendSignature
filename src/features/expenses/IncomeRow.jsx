import { useCurrency } from "../../context/CurrencyContext";
import { formatCurrency, formattedFullDate } from "../../utils/helpers";
import { HiArrowUpCircle } from "react-icons/hi2";
import Modal from "../../ui/Modal";
import IncomeDetails from "../wallet/IncomeDetails"; // Reuse your existing modal!

function IncomeRow({ incomeItem }) {
  const { currency } = useCurrency();
  const { id, income, date, source } = incomeItem;

  return (
    <Modal>
      <Modal.Open opens={`income-${id}`}>
        <div
          title="View Income Details"
          // 💡 1. Added bg-emerald-50/40 for that permanent, ultra-soft highlight
          className="group mb-1 flex cursor-pointer items-center justify-between rounded-xl border border-transparent bg-emerald-50/40 p-3 transition-all hover:border-emerald-200 hover:bg-emerald-100/50 hover:shadow-sm dark:bg-emerald-900/10 dark:hover:border-emerald-800 dark:hover:bg-emerald-900/20"
        >
          {/* LEFT: Icon & Title */}
          <div className="flex items-center gap-3">
            <HiArrowUpCircle className="h-6 w-6 text-emerald-500 transition-transform duration-300 group-hover:scale-110 dark:text-emerald-400" />
            <span className="font-sans font-bold text-slate-700 transition-colors group-hover:text-emerald-800 dark:text-slate-200">
              {source}
            </span>
          </div>

          {/* RIGHT: Badge, Amount, Date */}
          <div className="flex items-center gap-4 text-sm md:gap-6">
            {/* 💡 2. Replaced the empty spacer with a sleek Income Badge! */}
            <div className="hidden items-center justify-center rounded-md bg-emerald-100/60 px-2.5 py-1 text-[10px] font-black tracking-widest text-emerald-600 uppercase sm:flex dark:bg-emerald-500/10 dark:text-emerald-400">
              Income
            </div>

            <div className="flex flex-col items-end sm:flex-row sm:items-center sm:gap-6">
              <span className="font-sans font-black text-emerald-600 dark:text-emerald-400">
                +{formatCurrency(income, currency)}
              </span>
              <span className="font-sans text-xs font-medium text-emerald-600/60 sm:text-sm dark:text-emerald-400/50">
                {formattedFullDate(date)}
              </span>
            </div>
          </div>
        </div>
      </Modal.Open>

      <Modal.Window name={`income-${id}`}>
        <IncomeDetails incomeItem={incomeItem} />
      </Modal.Window>
    </Modal>
  );
}

export default IncomeRow;
