import { useUser } from "../features/authentication/useUser";
import UpdateOptions from "../features/settings/UpdateOptions";
import Redirect from "../ui/Redirect";

function Settings() {
  const { user, isAuthenticated } = useUser();
  if (user === null || !isAuthenticated)
    return <Redirect pageName="settings" />;

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <p className="text-gray-600">
        Manage your password and country preference.
      </p>
      <UpdateOptions />
    </div>
  );
}

export default Settings;
