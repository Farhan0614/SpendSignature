import { HiBanknotes } from "react-icons/hi2";
import { useUser } from "../features/authentication/useUser";
import WalletBody from "../features/wallet/WalletBody";
import WalletNav from "../features/wallet/WalletNav";
import Redirect from "../ui/Redirect";
import Heading from "../ui/Heading";

function Wallet() {
  const { user, isAuthenticated } = useUser();
  if (!isAuthenticated) return <Redirect pageName="wallet" />;

  return (
    <div className="space-y-8">
      {/* HEADER SECTION - Matches Expenses.js exactly */}
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 xl:flex-row xl:items-center xl:justify-between">
        {/* Left: Title */}
        <div className="flex items-center gap-2 text-slate-900">
          <HiBanknotes className="h-8 w-8 text-indigo-600" />
          <Heading>My Wallet</Heading>
        </div>

        {/* Right: Controls */}
        <div className="w-full overflow-x-auto pb-1 md:w-auto md:pb-0">
          <WalletNav />
        </div>
      </header>

      {/* BODY SECTION */}
      <WalletBody />
    </div>
  );
}

export default Wallet;
