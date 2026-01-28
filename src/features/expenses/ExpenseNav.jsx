import { useSearchParams } from "react-router-dom";
import DateNavigator from "../../ui/DateNavigator"; // Make sure path is correct
import YearNavigator from "../../ui/YearNavigator"; // Make sure path is correct
import ViewToggle from "../../ui/ViewToggle";

function ExpenseNav() {
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view") || "monthly";

  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
      <ViewToggle />

      {view === "monthly" ? <DateNavigator /> : <YearNavigator />}
    </div>
  );
}

export default ExpenseNav;
