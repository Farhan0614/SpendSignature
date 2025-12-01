import countryList from "react-select-country-list";
import countryToCurrency from "country-to-currency";
import { format, formatDistance, parseISO } from "date-fns";
import { differenceInDays } from "date-fns";
import getSymbolFromCurrency from "currency-symbol-map";

// We want to make this function work for both Date objects and strings (which come from Supabase)
export const subtractDates = (dateStr1, dateStr2) =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  })
    .replace("about ", "")
    .replace("in", "In");

// Supabase needs an ISO date string. However, that string will be different on every render because the MS or SEC have changed, which isn't good. So we use this trick to remove any time
export const getToday = function (options = {}) {
  const today = new Date();

  // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
  if (options?.end)
    // Set to the last second of the day
    today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};

// export const formatCurrency = (value, currencyCode) =>
//   new Intl.NumberFormat("en", {
//     style: "currency",
//     currency: currencyCode,
//   }).format(value);

export function formatCurrency(value, currencyCode = "USD") {
  const symbol = getSymbolFromCurrency(currencyCode) || currencyCode;

  // Use Intl for number formatting + symbol from package
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "symbol", // ensures symbol is preferred when available
  })
    .formatToParts(value)
    .map((part) => {
      if (part.type === "currency") {
        return symbol; // Replace Intl's currency with our own symbol
      }
      return part.value;
    })
    .join("");
}

export function findCountryByCurrency(currencyCode) {
  const options = countryList().getData();
  return (
    options.find((c) => countryToCurrency[c.value] === currencyCode) || null
  );
}

export function formattedTitle(title) {
  return title
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function formattedFullDate(date) {
  return format(parseISO(date), "MMMM dd, yyyy");
}

export function getMonthName(monthNumber) {
  // monthNumber should be 1–12
  return new Date(2000, monthNumber - 1) // Year doesn't matter
    .toLocaleString("default", { month: "long" });
}
