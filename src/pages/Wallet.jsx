import BalanceCards from "../features/wallet/BalanceCards";
import History from "../features/wallet/History";
import IncomeForm from "../features/wallet/IncomeForm";
import { useGetIncome } from "../features/wallet/useGetIncome"; // Import the master hook
import Loader from "../ui/Loader";

function Wallet() {
  // 1. Fetch ALL income data once
  const { incomes, isLoading } = useGetIncome();

  if (isLoading) return <Loader />;

  // 2. Derive the totals locally
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Calculate Total Balance
  const totalBalance =
    incomes?.reduce((sum, item) => sum + item.income, 0) || 0;

  // Calculate Monthly Balance
  const monthlyBalance =
    incomes
      ?.filter(
        (item) => item.month === currentMonth && item.year === currentYear,
      )
      .reduce((sum, item) => sum + item.income, 0) || 0;

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      {/* 3. Pass calculated values down as props */}
      <BalanceCards
        totalBalance={totalBalance}
        monthlyBalance={monthlyBalance}
        isLoading={isLoading}
      />

      <section className="flex flex-col gap-6">
        <IncomeForm />
        <History incomes={incomes} isLoading={isLoading} />
      </section>
    </main>
  );
}

export default Wallet;
