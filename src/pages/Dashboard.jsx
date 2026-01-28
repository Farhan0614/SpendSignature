import { useUser } from "../features/authentication/useUser";
import DashboardBody from "../features/Dashboard/DashboardBody";
import Redirect from "../ui/Redirect";

function Dashboard() {
  const { user, isAuthenticated } = useUser();

  if (user === null || !isAuthenticated)
    return <Redirect pageName="dashboard" />;
  return (
    <div>
      <DashboardBody />
    </div>
  );
}

export default Dashboard;
