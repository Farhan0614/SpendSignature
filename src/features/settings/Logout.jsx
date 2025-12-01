import { useCurrency } from "../../context/CurrencyContext";
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
      <h2 className="text-lg font-semibold text-gray-900">Login Options</h2>
      <button
        onClick={handleLogout}
        className="flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-700 focus:ring focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
      >
        {isLoading ? <LoaderMini /> : "Logout"}
      </button>
    </div>
  );
}

export default Logout;
