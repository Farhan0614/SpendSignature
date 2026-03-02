import { useCurrency } from "../../context/CurrencyContext";
import Button from "../../ui/Button";
import LoaderMini from "../../ui/LoaderMini";
import { useLogout } from "../authentication/useLogout";

function Logout() {
  const { logout, isLoading } = useLogout();
  const { setCountry, setCurrency } = useCurrency();

  function handleLogout() {
    setCountry(null);
    setCurrency("USD");
    logout();
  }

  return (
    <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Logout Options</h2>
      <Button variant="danger" onClick={handleLogout} className="w-full">
        {isLoading ? <LoaderMini /> : "Logout"}
      </Button>
    </div>
  );
}

export default Logout;
