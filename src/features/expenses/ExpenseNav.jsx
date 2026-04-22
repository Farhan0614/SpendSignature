import { useSearchParams } from "react-router-dom";
import DateNavigator from "../../ui/DateNavigator";
import YearNavigator from "../../ui/YearNavigator";
import ViewToggle from "../../ui/ViewToggle";
import SortBy from "../../ui/SortBy";
import ExpenseSearch from "./ExpenseSearch";

function ExpenseNav() {
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view") || "monthly";

  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
      <ViewToggle />
      <ExpenseSearch />
      {view === "monthly" ? <DateNavigator /> : <YearNavigator />}

      <SortBy
        options={[
          { value: "date-desc", label: "Newest First" },
          { value: "date-asc", label: "Oldest First" },
          { value: "amount-desc", label: "Amount (High)" },
          { value: "amount-asc", label: "Amount (Low)" },
        ]}
      />
    </div>
  );
}

export default ExpenseNav;
