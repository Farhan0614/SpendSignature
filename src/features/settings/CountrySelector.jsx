import { useMemo, useCallback } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";
import ReactCountryFlag from "react-country-flag";
import { useDarkMode } from "../../context/DarkModeContext";

function CountrySelector({ value, onChange }) {
  const options = useMemo(() => countryList().getData(), []);
  const { isDarkMode } = useDarkMode();

  const formatOptionLabel = useCallback(
    ({ label, value }) => (
      <div className="flex items-center gap-2">
        <ReactCountryFlag
          countryCode={value}
          svg
          style={{ width: "1.2em", height: "1.2em" }}
        />
        <span>{label}</span>
      </div>
    ),
    [],
  );

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      cursor: "pointer",
      // Dark: Slate-900, Light: Gray-50
      backgroundColor: isDarkMode ? "#0f172a" : "#f9fafb",
      minHeight: "2.5rem",
      border: isDarkMode ? "1px solid #334155" : "1px solid #e5e7eb", // Slate-700 vs Gray-200
      transition: "all 0.3s",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: isDarkMode ? "#94a3b8" : "#9ca3af", // Slate-400 vs Gray-400
      fontSize: "0.875rem",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: isDarkMode ? "#f8fafc" : "#111827", // White vs Gray-900
      fontSize: "0.875rem",
      fontWeight: 500,
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: "0.875rem",
      fontWeight: state.isSelected ? 600 : 400,
      backgroundColor: state.isSelected
        ? isDarkMode
          ? "#4f46e5"
          : "#e0e7ff" // Indigo-600 vs Indigo-100
        : state.isFocused
          ? isDarkMode
            ? "#1e293b"
            : "#f3f4f6" // Slate-800 vs Gray-100
          : isDarkMode
            ? "#0f172a"
            : "#fff", // Slate-900 vs White
      color:
        state.isSelected && isDarkMode
          ? "#fff"
          : isDarkMode
            ? "#cbd5e1"
            : "#111827",
      cursor: "pointer",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      overflow: "hidden",
      backgroundColor: isDarkMode ? "#0f172a" : "#fff", // Slate-900 vs White
      border: isDarkMode ? "1px solid #334155" : "none",
      boxShadow:
        "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
    }),
    input: (provided) => ({
      ...provided,
      color: isDarkMode ? "#f8fafc" : "#111827",
    }),
  };

  return (
    <div className="w-64">
      <Select
        options={options}
        value={value}
        onChange={onChange}
        formatOptionLabel={formatOptionLabel}
        placeholder="Select country..."
        isSearchable
        styles={customStyles}
      />
    </div>
  );
}

export default CountrySelector;
