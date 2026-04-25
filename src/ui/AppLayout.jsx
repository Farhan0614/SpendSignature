import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useUser } from "../features/authentication/useUser";
import Loader from "./Loader";
import { useProfile } from "../features/settings/useProfile";
import { useEffect } from "react";
import { findCountryByCurrency } from "../utils/helpers";
import { useCurrency } from "../context/CurrencyContext";
import { useSyncSubscriptions } from "../features/subscriptions/useSyncSubscriptions";

function AppLayout() {
  const { user, isLoading, isAuthenticated } = useUser();
  const { profile, isLoading: isLoadingProfile } = useProfile();
  const { setCountry, setCurrency } = useCurrency();

  useSyncSubscriptions();

  useEffect(() => {
    if (profile?.currency) {
      setCurrency(profile.currency);
      const matchedCountry = findCountryByCurrency(profile.currency);
      if (matchedCountry) setCountry(matchedCountry);
    }
  }, [profile, setCountry, setCurrency]);

  if (isLoading || isLoadingProfile) return <Loader className="h-screen" />;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
