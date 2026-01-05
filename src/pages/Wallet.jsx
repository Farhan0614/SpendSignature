import { useUser } from "../features/authentication/useUser";
import WalletBody from "../features/wallet/WalletBody";
import Redirect from "../ui/Redirect";

function Wallet() {
  const { user, isAuthenticated } = useUser();
  if (!isAuthenticated) return <Redirect pageName="wallet" />;

  return (
    <div className="space-y-8">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">My Wallet</h1>
      <WalletBody />
    </div>
  );
}

export default Wallet;
