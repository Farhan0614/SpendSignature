import { Outlet } from "react-router-dom";

import Header from "./Header";

import SideBar from "./SideBar";

import { useUser } from "../features/authentication/useUser";

import Loader from "./Loader";

import { useCurrency } from "../context/CurrencyContext";

import { useEffect } from "react";

import { findCountryByCurrency } from "../utils/helpers";

function AppLayout() {
  const { user, isLoading, isAuthenticated } = useUser();

  const { setCurrency, setCountry } = useCurrency();

  useEffect(() => {
    if (isAuthenticated && user) {
      const userCurrency = user.user_metadata?.currency || "USD";

      setCurrency(userCurrency);

      const matchedCountry = findCountryByCurrency(userCurrency);

      setCountry(matchedCountry);
    }
  }, [isAuthenticated, user, setCurrency, setCountry]);

  if (isLoading) return <Loader />;

  return (
    <div className="grid h-dvh grid-cols-[200px_1fr] grid-rows-[auto_1fr] font-sans text-gray-700">
      <Header user={user} />

      <SideBar />

      <main className="overflow-y-scroll">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
