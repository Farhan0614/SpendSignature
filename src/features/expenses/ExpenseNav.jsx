import { useSearchParams } from "react-router-dom";
import ExpenseButton from "../../ui/ExpenseButton";
import {
  BsCalendar2Event,
  BsCalendar2Minus,
  BsCalendar3,
  BsClock,
} from "react-icons/bs";

function ExpenseNav() {
  const [searchParams, setSearchParams] = useSearchParams();

  function handleClick(view) {
    if (view === "daily") {
      searchParams.delete("view");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ view });
    }
  }

  const currentView = searchParams.get("view") || "daily";

  return (
    <ul className="flex items-center gap-2">
      <li>
        <ExpenseButton
          onClick={() => handleClick("daily")}
          isActive={currentView === "daily"}
        >
          <BsCalendar2Event className="h-4 w-4" />
          <span>Daily</span>
        </ExpenseButton>
      </li>
      <li>
        <ExpenseButton
          onClick={() => handleClick("monthly")}
          isActive={currentView === "monthly"}
        >
          <BsCalendar2Minus className="h-4 w-4" />
          <span>Monthly</span>
        </ExpenseButton>
      </li>
      <li>
        <ExpenseButton
          onClick={() => handleClick("calender")}
          isActive={currentView === "calender"}
        >
          <BsCalendar3 className="h-4 w-4" />
          <span>Calender</span>
        </ExpenseButton>
      </li>
      <li>
        <ExpenseButton
          onClick={() => handleClick("yearly")}
          isActive={currentView === "yearly"}
        >
          <BsClock className="h-4 w-4" />
          <span>Yearly</span>
        </ExpenseButton>
      </li>
    </ul>
  );
}

export default ExpenseNav;
