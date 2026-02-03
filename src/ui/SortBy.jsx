import { useSearchParams } from "react-router-dom";

function SortBy({ options }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "";

  function handleChange(e) {
    searchParams.set("sortBy", e.target.value);
    setSearchParams(searchParams);
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-slate-500">Sort by</span>
      <select
        value={sortBy}
        onChange={handleChange}
        className="cursor-pointer rounded-lg border border-slate-200 bg-white py-2 pr-8 pl-3 text-sm font-medium text-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
      >
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SortBy;
