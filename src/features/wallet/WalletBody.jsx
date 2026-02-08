import { useBalanceData } from "./useBalanceData";
import Loader from "../../ui/Loader";
import { useGetIncome } from "./useGetIncome";
import BalanceCards from "./BalanceCards";
import IncomeForm from "./IncomeForm";
import History from "./History";

function WalletBody() {
  // 1. Get Data & View State
  const { incomes, isLoading, view } = useGetIncome();
  const { currentBalance, isLoading: loadingBalance } = useBalanceData();

  if (isLoading || loadingBalance) return <Loader />;

  // 3. Calculate Total (Dynamic: Works for Month OR Year list automatically)
  const incomeTotal = incomes?.reduce((sum, item) => sum + item.income, 0) || 0;

  return (
    <div className="space-y-8">
      {/* SECTION 1: STATS */}
      <section>
        <BalanceCards
          totalBalance={currentBalance}
          monthlyBalance={incomeTotal}
          // Dynamic Label based on view
          label={view === "monthly" ? "Monthly Income" : "Yearly Income"}
          isLoading={false}
        />
      </section>

      {/* SECTION 2: ACTION & HISTORY */}
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

export default WalletBody;
