import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "../features/authentication/useUser"; // 1. Import useUser
import { findCountryByCurrency } from "../utils/helpers";

const CurrencyContext = createContext();

function CurrencyProvider({ children }) {
  const { user } = useUser(); // 2. Get the current user status

  const [country, setCountry] = useState(null);
  const [currency, setCurrency] = useState("USD");

  return (
    <CurrencyContext.Provider
      value={{ country, setCountry, currency, setCurrency }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined)
    throw new Error("CurrencyContext was used outside CurrencyProvider");
  return context;
}

export { CurrencyProvider, useCurrency };
