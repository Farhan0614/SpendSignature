import { useMemo, useCallback } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";
import ReactCountryFlag from "react-country-flag";

function CountrySelector({ value, onChange }) {
  const options = useMemo(() => countryList().getData(), []);

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
    control: (provided, state) => ({
      ...provided,
      borderRadius: "0.5rem",
      cursor: "pointer",
      backgroundColor: "#f9fafb",
      minHeight: "2.5rem",

      transition: "all 0.3s",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
      fontSize: "0.875rem",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#111827",
      fontSize: "0.875rem",
      fontWeight: 500,
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: "0.875rem",
      fontWeight: state.isSelected ? 600 : 400,
      backgroundColor: state.isSelected
        ? "#e0e7ff"
        : state.isFocused
          ? "#f3f4f6"
          : "#fff",
      color: "#111827",
      cursor: "pointer",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      overflow: "hidden",
      boxShadow:
        "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
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
