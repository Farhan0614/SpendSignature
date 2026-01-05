import { useQuery } from "@tanstack/react-query";
import { useUser } from "../authentication/useUser";
import { useBalanceData } from "./useBalanceData";
import { useGetIncome } from "./useGetIncome";
import { getCurrentMonthIncome } from "../../services/apiDashboard";
import Loader from "../../ui/Loader";
import BalanceCards from "./BalanceCards";
import IncomeForm from "./IncomeForm";
import History from "./History";

function Wallet() {
  const { user } = useUser();

  // 1. Fetch History List (Will be paginated later)
  const { incomes, isLoading } = useGetIncome();

  // 2. Fetch Global Balance (Lightweight)
  const { currentBalance, isLoading: loadingBalance } = useBalanceData();

  // 3. Fetch Monthly Income ONLY (Targeted & Future-Proof)
  // We use the same query key ["monthIncome"] so it shares cache with the Dashboard!
  const { data: monthData, isLoading: loadingMonth } = useQuery({
    queryKey: ["monthIncome", user?.id],
    queryFn: () => getCurrentMonthIncome(user.id),
    enabled: !!user,
  });

  if (isLoading || loadingBalance || loadingMonth) return <Loader />;

  // Calculate total from the specific monthly data
  const monthlyIncome =
    monthData?.reduce((sum, item) => sum + item.income, 0) || 0;

  return (
    <div className="space-y-8">
      {/* SECTION 1: HEADER & STATS */}
      <section>
        <BalanceCards
          totalBalance={currentBalance}
          monthlyBalance={monthlyIncome}
          isLoading={false}
        />
      </section>

      {/* SECTION 2: ACTION & HISTORY GRID */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* LEFT: ADD INCOME */}
        <div className="h-[450px]">
          <IncomeForm />
        </div>

        {/* RIGHT: HISTORY */}
        <div className="h-[450px]">
          <History incomes={incomes} isLoading={isLoading} />
        </div>
      </section>
    </div>
  );
}

export default Wallet;
