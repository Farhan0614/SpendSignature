import Loader from "../../ui/Loader";
import IncHisItem from "./IncHisItem";

function History({ incomes, isLoading }) {
  return (
    // CHANGED: Removed w-[500px]. Added h-full and w-full.
    <div className="flex h-full w-full flex-col rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-slate-700">Income History</h2>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader />
        </div>
      ) : !incomes || incomes.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-slate-100 py-10">
          <p className="font-medium text-slate-400">No income records yet</p>
        </div>
      ) : (
        <div className="custom-scrollbar flex-1 overflow-y-auto pr-2">
          <ul className="flex flex-col gap-2">
            {incomes.map((income) => (
              <IncHisItem
                key={income.id}
                amount={income.income}
                month={income.month}
                year={income.year}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default History;
