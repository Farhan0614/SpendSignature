import BalanceCards from "../features/wallet/BalanceCards";
import MonthlyIncHist from "../features/wallet/MonthlyIncHist";

function Wallet() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <BalanceCards />
      <MonthlyIncHist />
    </main>
  );
}

export default Wallet;
