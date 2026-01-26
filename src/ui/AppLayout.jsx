import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useUser } from "../features/authentication/useUser";
import Loader from "./Loader";
import { useProfile } from "../features/settings/useProfile";
import { useEffect } from "react";
import { findCountryByCurrency } from "../utils/helpers";
import { useCurrency } from "../context/CurrencyContext";

function AppLayout() {
  const { user, isLoading, isAuthenticated } = useUser();
  const { profile, isLoading: isLoadingProfile } = useProfile();
  const { setCountry, setCurrency } = useCurrency();

  useEffect(() => {
    if (profile?.currency) {
      setCurrency(profile.currency);
      const matchedCountry = findCountryByCurrency(profile.currency);
      if (matchedCountry) setCountry(matchedCountry);
    }
  }, [profile, setCountry, setCurrency]);

  if (isLoading || isLoadingProfile) return <Loader />;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
      {/* 1. Sticky Header */}
      <Header />

      {/* 2. Main Content Area */}
      {/* flex-1 ensures it pushes the footer down if content is short */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* We use an animation wrapper here for page transitions if you want later */}
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
}

export default AppLayout;
