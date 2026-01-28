import YearNavigator from "../../ui/YearNavigator";
import { useBalanceData } from "./useBalanceData";
import Loader from "../../ui/Loader";
import { useGetIncome } from "./useGetIncome";
import DateNavigator from "../../ui/DateNavigator";
import BalanceCards from "./BalanceCards";
import IncomeForm from "./IncomeForm";
import History from "./History";
import ViewToggle from "../../ui/ViewToggle";

function Wallet() {
  // 1. Get Data & View State
  const { incomes, isLoading, view } = useGetIncome();
  const { currentBalance, isLoading: loadingBalance } = useBalanceData();

  if (isLoading || loadingBalance) return <Loader />;

  // 3. Calculate Total (Dynamic: Works for Month OR Year list automatically)
  const incomeTotal = incomes?.reduce((sum, item) => sum + item.income, 0) || 0;

  return (
    <div className="space-y-8">
      {/* SECTION 1: HEADER & CONTROLS */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <ViewToggle />

          {view === "monthly" ? <DateNavigator /> : <YearNavigator />}
        </div>
      </div>

      {/* SECTION 2: STATS */}
      <section>
        <BalanceCards
          totalBalance={currentBalance}
          monthlyBalance={incomeTotal}
          // Dynamic Label based on view
          label={view === "monthly" ? "Monthly Income" : "Yearly Income"}
          isLoading={false}
        />
      </section>

      {/* SECTION 3: ACTION & HISTORY */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="h-[500px]">
          <IncomeForm />
        </div>

        <div className="h-[500px]">
          <History incomes={incomes} isLoading={isLoading} view={view} />
        </div>
      </section>
    </div>
  );
}

export default Wallet;
