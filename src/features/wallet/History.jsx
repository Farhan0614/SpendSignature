import Loader from "../../ui/Loader";
import IncHisItem from "./IncHisItem";
import { useGetIncome } from "./useGetIncome";

function History() {
  const { incomes, isLoading } = useGetIncome();

  return (
    <div className="flex w-full flex-col rounded-2xl bg-white p-6 shadow-md md:w-[500px]">
      <h2 className="mb-4 text-lg font-semibold">Income History</h2>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader />
        </div>
      ) : !incomes || incomes.length === 0 ? (
        <p className="text-gray-500">No income records yet</p>
      ) : (
        <div className="max-h-64 overflow-y-auto pr-2">
          <ul className="divide-y">
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
