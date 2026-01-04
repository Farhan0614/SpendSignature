import { useState } from "react";
import CountrySelector from "./CountrySelector";
import Logout from "./Logout";
import { useUpdateUserCurrency } from "./useUpdateUserCurrency";
import LoaderMini from "../../ui/LoaderMini";
import { useCurrency } from "../../context/CurrencyContext";
import { useUser } from "../authentication/useUser";

function UpdateOptions() {
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const { updateUserCurrency, isLoading } = useUpdateUserCurrency();
  const { currency } = useCurrency();
  const { user } = useUser();

  const isChanged = currency !== (user?.user_metadata?.currency || "USD");

  function handlePasswordChange(e) {
    e.preventDefault();
    console.log("Old:", oldPassword, "New:", newPassword);
  }

  function handleChangeCurrency() {
    if (isChanged) updateUserCurrency(currency);
  }

  return (
    <>
      <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Change Password
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-3">
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring focus:ring-indigo-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring focus:ring-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-indigo-700 focus:ring focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            Change Password
          </button>
        </form>
      </div>

      {/* Change Country Section */}
      <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Change Country</h2>
        <CountrySelector />
        <button
          onClick={handleChangeCurrency}
          disabled={!isChanged || isLoading}
          className={`mt-7 flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-300 ${
            !isChanged || isLoading
              ? "cursor-not-allowed bg-slate-300"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isLoading ? <LoaderMini /> : "Save Country"}
        </button>
      </div>

      {/* Login / Logout Section */}
      <Logout />
    </>
  );
}

export default UpdateOptions;
