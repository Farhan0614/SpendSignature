import { HiCog6Tooth } from "react-icons/hi2";
import { useUser } from "../features/authentication/useUser";
import UpdateOptions from "../features/settings/UpdateOptions";
import Redirect from "../ui/Redirect";
import Heading from "../ui/Heading";

function Settings() {
  const { user, isAuthenticated } = useUser();
  if (user === null || !isAuthenticated)
    return <Redirect pageName="settings" />;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <header className="flex items-center gap-2 border-b border-slate-200 pb-6 text-slate-900">
        <HiCog6Tooth className="h-8 w-8 text-indigo-600" />
        <div>
          <Heading>Settings</Heading>
          <p className="mt-1 text-sm text-slate-500">
            Manage your profile, password, and preferences.
          </p>
        </div>
      </header>

      <UpdateOptions />
    </div>
  );
}

export default Settings;
