import { createContext, useContext, useState } from "react";

const CurrencyContext = createContext();

function CurrencyProvider({ children }) {
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
