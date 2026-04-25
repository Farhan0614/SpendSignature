import { useNavigate } from "react-router-dom";
import { FaCreditCard } from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi2";

import Heading from "../ui/Heading";
import Redirect from "../ui/Redirect";
import { useUser } from "../features/authentication/useUser";
import NewSubscription from "../features/subscriptions/NewSubscription";
import SubscriptionTable from "../features/subscriptions/SubscriptionTable";

function Subscriptions() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();

  if (user === null || !isAuthenticated) {
    return <Redirect pageName="subscriptions" />;
  }

  return (
    <div className="space-y-8">
      <div>
        <button
          onClick={() => navigate("/expense")}
          className="mb-4 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <HiArrowLeft className="h-4 w-4" />
          Back to Expenses
        </button>

        <header className="flex flex-col gap-4 border-b border-slate-200 pb-4 xl:flex-row xl:items-center xl:justify-between dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
              <FaCreditCard className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
              <Heading>Recurring Subscriptions</Heading>
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage recurring bills that automatically generate expense
              entries.
            </p>
          </div>

          <div className="w-full md:w-auto">
            <NewSubscription />
          </div>
        </header>
      </div>

      <SubscriptionTable />
    </div>
  );
}

export default Subscriptions;
