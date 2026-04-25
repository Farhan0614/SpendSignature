import { useState } from "react";
import { HiMinusSm, HiPlusSm } from "react-icons/hi";
import Button from "../../ui/Button";
import SubscriptionForm from "./SubscriptionForm";

function NewSubscription() {
  const [showForm, setShowForm] = useState(false);

  function handleToggleForm() {
    setShowForm((value) => !value);
  }

  return (
    <div>
      <Button onClick={handleToggleForm} variant="primary">
        {showForm ? (
          <HiMinusSm className="h-5 w-5" />
        ) : (
          <HiPlusSm className="h-5 w-5" />
        )}
        <span>New Subscription</span>
      </Button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          showForm
            ? "mt-6 max-h-[1200px] scale-100 opacity-100"
            : "max-h-0 scale-95 opacity-0"
        }`}
      >
        <SubscriptionForm onCloseForm={() => setShowForm(false)} />
      </div>
    </div>
  );
}

export default NewSubscription;
